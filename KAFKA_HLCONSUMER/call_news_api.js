const mongoose = require("mongoose");
const NewsAPI = require('newsapi');
const db = require('./db/mongodb')
const API_KEY = process.env.API_KEY;
var AWS = require('aws-sdk');
const News = require('./api/models/newsModel')
var request = require('request');
const rp = require('request-promise')
// const Feedback = require('../api/models/feedbackModel')
// var ObjectId = mongoose.Types.ObjectId;
const winston = require('./config/logfive')
var moment = require('moment-timezone');
var _MOMENT = require('moment')
// winston.error(API_KEY)
// var publishToQueue = require('../../services/MQService')
// const newsapi = new NewsAPI('asfasfsfadsfsadfsadfdsfdsf');
// const newsapi_bk = new NewsAPI("asdfasdfadsfdsfdsfdsfsfasdfsd"); //business key
const newsapi_bk = new NewsAPI(process.env.API_KEY)
const BUCKET_NAME = 'imcm-bucket';

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  }
});

exports.CALL_NEWS_API = async function(mongoid){
    let PAYLOAD_LOOP = "";
    let TIMES_TO_LOOP = "";
    let queryOps = "";
    let S3_FILENAME = "";

    try {
        winston.info("mongoid::>>", mongoid)
        queryOps = await GET_QUERY_DETAILS_FROM_MONGODB(mongoid)
        var queryPayload = {
            q: queryOps.q,
            from: queryOps.from,
            to: queryOps.to,
            language: queryOps.language,
            sortBy:queryOps.sortby
        }
        var ARRAY_OF_DATES = await enumerateDaysBetweenDates(moment(queryOps.from), moment(queryOps.to));
        // winston.info(ARRAY_OF_DATES)
        TIMES_TO_LOOP = await TOTAL_RESULTS_AND_LOOP_INFO(queryPayload);
        PAYLOAD_LOOP = await get_loop_info_from_news_api(ARRAY_OF_DATES,queryPayload);
        var query_results = await LOOPING_THE_DATE_BY_DATE_PAYLOAD(PAYLOAD_LOOP, TIMES_TO_LOOP.totalResults)
        var saveInAWSS3Bucket_filename = await SAVE_JSON_FILE_IN_S3_BUCKET(query_results,mongoid )
        S3_FILENAME = saveInAWSS3Bucket_filename
        if(query_results.status == "ok"){
            // console.info(new Blob([JSON.stringify(query_results.articles)]).size); 
            winston.info("query_results.totalresylts::", query_results.totalResults, query_results
            .totalSize)
            // queryOps["querytype"]= "everything"
            queryOps["ntimestamp"] = Date.now()
            queryOps["nhrtimestamp"]= moment().format("YYYY-MM-DD:HH:mm:ss:sss");
            queryOps["totalresults"]=query_results.totalResults;
            queryOps["status"]="RBnotstarted"; //notstarted //inprogess //completed
            // queryOps["articles"]=query_results.articles;
            queryOps["s3"]=saveInAWSS3Bucket_filename;
            queryOps["errormessage"] = "";
          } 
          if(query_results.status ==  "notOk"){
            winston.fatal("query_results.error::", query_results.totalResults, query_results.message,query_results
            .totalSize)
            // queryOps["querytype"]= "everything"
            queryOps["ntimestamp"] = Date.now()
            queryOps["nhrtimestamp"]= moment().format("YYYY-MM-DD:HH:mm:ss:sss");
            queryOps["totalresults"]=query_results.totalResults;
            queryOps["status"]="RBnotstarted"; //notstarted //inprogess //completed
            // queryOps["articles"]=query_results.articles;
            queryOps["s3"]=saveInAWSS3Bucket_filename;
            queryOps["errormessage"] = query_results.message;
          } 
          var saveInDb =  after_query_save_news_api_query_results_in_db(queryOps, mongoid)
          // Job schedular jobs
          var processViaflaskserver = await CALL_FLASK_SERVER(mongoid, S3_FILENAME)
          var updateDb = await UPDATE_CLUSTER_INFO(processViaflaskserver.id,processViaflaskserver.s3cluster,Date.now(),moment().format("YYYY-MM-DD:HH:mm:ss:sss"))

          // 


        return true
        // var query_results =  await runLoopForArticles(queryOps) 
    } catch(err){
        winston.error("CALL_NEWS_API::>>",err)
        if(err.timesToLoop == 0){
            winston.fatal("Err.timesToLoop",err.timesToLoop )
            queryOps["totalresults"] = err.totalResults
            queryOps["errormessage"] = "no results found for the query"
            queryOps["articles"]=err.articles;
            queryOps["ntimestamp"] = Date.now()
            queryOps["nhrtimestamp"]= moment().format("YYYY-MM-DD:HH:mm:ss:sss");
            queryOps["status"]="completed";
            queryOps["s3"]="";
            after_query_save_news_api_query_results_in_db(queryOps,mongoid)
            return true
          }
          if(err.status == 3){
            winston.info("CALL_FLASK_SERVER::>>",err)
            FLASK_UPDATE_PROGRESS_STATUS(err.id,"error",err.desc)
            return true
        }
          return err
    }
}

const GET_QUERY_DETAILS_FROM_MONGODB = function(mongoid){
    return new Promise((resolve,reject)=>{
        winston.info("mongoid_inside::>>", mongoid)
        News.findOne({_id:mongoid})
        .then(function(result){
            // winston.info("ressssss", result.length, result)
            if(result){
              winston.info("GET_QUERY_DETAILS_FROM_MONGODB", result)
              resolve(result)
            } else {
              winston.info("GET_QUERY_DETAILS_FROM_MONGODB", result)
              reject({
                 status:-1,
                error:"unable to find query details from db-mongodb"
              })
            }
           
        })
        .catch(function(err){
            winston.error("Unable to get query details from db ",err)
            reject({
                status:-1,
                error:"unable to find query details from db"
            })
        })
    })
}
var enumerateDaysBetweenDates = function(startDate, endDate) {
    var now = startDate, dates = [];
    while (now.isSameOrBefore(endDate)) {
       dates.push(now.format('YYYY-MM-DD'));
       now.add(1, 'days');
    }
    return dates;
};
const TOTAL_RESULTS_AND_LOOP_INFO =  function(payload){
    return new Promise((resolve,reject)=>{
      payload.apiKey ="90370223ba2047a5b646da6693ceb3e2"
      newsapi_bk.v2.everything(payload).then(result => {
        // winston.info(result.totalResults)
        let timesToLoop = 0;
        const pageSize =100;
        if(result.totalResults >0 ){
          timesToLoop = Math.ceil(result.totalResults/pageSize)
          winston.info('timesToLoop', timesToLoop)
          resolve({timesToLoop:timesToLoop,totalResults:result.totalResults, articles:result.articles})
        }else {
          timesToLoop = Math.ceil(result.totalResults/pageSize)
          // reject(`no articles found for this query [${payload.q}]`)
          reject({timesToLoop:result.totalResults,totalResults:result.totalResults, articles:result.articles})
        }
      }).catch(function(err){
          winston.error("get_loop_info_from_news_api::catch==>>",err)
          if(err.message){
            reject(err.message)
          }
          reject(`Unable to get results from newAPi for this query = [${payload.q}]`)
      })
    })
}


const get_loop_info_from_news_api =  function(ARRAY_OF_DATES,payload){
    return new Promise((resolve,reject)=>{
      // winston.fatal("SSSS",ARRAY_OF_DATES.length, payload)
      let arrayofpayload = [];
      for(var i=0; i<ARRAY_OF_DATES.length;i++){
        // winston.error(ARRAY_OF_DATES[i])
        var datefromto = ARRAY_OF_DATES[i];
        var newpayload = {
          q: payload.q,
          from: datefromto,
          to: datefromto,
          sortBy: payload.sortBy,
          pageSize:100
        }

        arrayofpayload.push(newpayload) 
      }
      // winston.fatal(arrayofpayload)
      var loop = {
        loop_payload: arrayofpayload,

      }
      resolve(arrayofpayload)
    })
  }

async function LOOPING_THE_DATE_BY_DATE_PAYLOAD(_PAYLOAD_ARRAY, totalResultams){
    winston.info("IAMCallewd")
    let artikles = [];
    let flatArrayArticles ="";
    let total_results =totalResultams;
    // winston.info("_APAHYLOAD", _PAYLOAD_ARRAY)
    try{
      for(let i=0; i<_PAYLOAD_ARRAY.length;i++){
        // for(let i=0; i<2;i++){
        let itereatePagePayload = {
          q: _PAYLOAD_ARRAY[i].q,
          from:_PAYLOAD_ARRAY[i].from,
          to: _PAYLOAD_ARRAY[i].to,
          sortBy: _PAYLOAD_ARRAY[i].sortBy,
          pageSize:_PAYLOAD_ARRAY[i].pageSize,
          apiKey: "90370223ba2047a5b646da6693ceb3e2",
          language: 'en'
        };
        // itereatePagePayload.page = i+1
        winston.info(itereatePagePayload)
        let payloadwithpage = await make_every_page_newsapi_call(itereatePagePayload)
        // winston.info("ii", i+1,payloadwithpage)    
        artikles.push(payloadwithpage.articles)
        // winston.info(i+1)
      }
      // winston.info("artikles==>>",artikles)
      flatArrayArticles = Array.prototype.concat.apply([], artikles);
      winston.info("JAIN===========================")
      var finalResults = {
        status: "ok",
        message: "allgood",
        totalResults: total_results,
        articles: flatArrayArticles,
        totalSize: flatArrayArticles.length
      }
      // {totolResults:results.totalResults,articles:flatArrayArticles}
      return finalResults
    }catch(err){
      winston.error("runLoopForArticles", err)
      flatArrayArticles = Array.prototype.concat.apply([], artikles);
      winston.info("flatarry", flatArrayArticles.length)
      if(err.message == "NEWSAPIERROR"){
        winston.fatal("hhhehh", err.message)
        var error = {
          status: "notOk",
          message: err.desc,
          articles: flatArrayArticles,
          totalResults: total_results,
          totalSize: flatArrayArticles.length
        }
        winston.error("eeeee",error.totalResults)
        return error
      }
      var error = {
        status: "notOk",
        message: err,
        articles: flatArrayArticles,
        totalResults: total_results,
        totalSize: flatArrayArticles.length
      }
      winston.error("ffffff",error.totalResults)
      return error
    }
  }

  make_every_page_newsapi_call = async function(payload2){
    return new Promise((resolve,reject)=>{
      newsapi_bk.v2.everything(payload2).then(response => {
        if(response.articles.length > 0 ){
          winston.info("make_every_page_newsapi_call:length:", response.articles.length);
          resolve({
            status: response.status,
            totalResults: response.totalResults,
            articles: response.articles
          })
        }
        // else {
        //   resolve({
        //     status: "notok",
        //     totalResults: 0,
        //     articles: `no results for ${payload2.q} for page ${payload2.page}`
        //   })
        // }
      }).catch(function(err){
          // winston.error("make_every_page_newsapi_call::catch==>>",err.message)
          if(err.message){
            // reject(err.message)
            reject({
              message: "NEWSAPIERROR",
              desc: err.message
            })
          }
          reject("unable to make a REST call to NewsApi")
      })
    })
  }
  const SAVE_JSON_FILE_IN_S3_BUCKET = function(QUERY_RESULTS, MONGOID){
    return new Promise((resolve,reject)=>{
      const params = {
        Bucket: BUCKET_NAME,
        Key: `${MONGOID}.json`, // File name you want to save as in S3
        Body: JSON.stringify(QUERY_RESULTS.articles)
      };
      var putObjectPromise = s3.upload(params).promise();
      putObjectPromise.then(function(data) {
        winston.info('Success',data);
        resolve(data.Location)
      }).catch(function(err) {
        winston.info(err);
        reject(err)
      });
    })
  }

  const after_query_save_news_api_query_results_in_db = function(payload, mongoId){
    return new Promise(function(resolve,reject){
      News.findByIdAndUpdate({_id: mongoId},{
        $set :{
          ntimestamp: payload.ntimestamp,
          nhrtimestamp: payload.nhrtimestamp,
          status: payload.status,
          totalresults: payload.totalresults,
          errormessage: payload.errormessage,
          articles: payload.articles,
          s3: payload.s3
        }
      },{new:true}).then(function(result){
        resolve(result)
      }).catch(function(err){
        winston.error("afterQuerySave::>>", err)
        reject(err)
      })
    })
  }



const CALL_FLASK_SERVER = function(_id, _s3url){
  return new Promise((resolve,reject)=>{
      console.log("CALLING_FLASK_SERVER", _id, _s3url)
      var obj = {
          id: _id,
          s3url: _s3url
      }
      var options = {
          method: 'GET',
          uri: 'https://lufthansadsl.tk/news/',
          // body: JSON.stringify({id:_id,s3url:_s3url }),
          body: obj,
          json: true // Automatically stringifies the body to JSON
      };
      rp(options).then(function (parsedBody) {
          // winston.debug(parsedBody)
          resolve({
              status:0,
              s3cluster: parsedBody.s3url,
              id: _id
          })
          // var _ptimestamp = Date.now();
          // var _phrtimestamp =moment().format("YYYY-MM-DD:HH:mm:ss:sss")
      })
      .catch(function (err) {
          // POST failed...
          //update db error
          winston.info("CALL_FLASK_SERVER.catch::>>err", _id)
          winston.error("CALL_FLASK_SERVER.catch::>>",_id ,err)
          reject({
              status:3,
              error:err,
              id:_id,
              desc: `Unable to get FLASKSERVER processed data for ${_id} `
          })
      });
  })
}

const UPDATE_CLUSTER_INFO = function(id,_s3cluster,_ptimestamp,_phrtimestamp){
  return new Promise((resolve,reject)=>{
      News.findByIdAndUpdate({_id:id},{
          $set:
          {
              s3cluster: _s3cluster,
              ptimestamp: _ptimestamp,
              phrtimestamp: _phrtimestamp,
              status: "completed"
          }
      }).then(result=>{
          resolve(true)
      }).catch(err=>{
          reject({
              status:3,
              error:err,
              desc: `Unable to get FLASKSERVER processed data for ${_id} `
          })
      })
  })
}

const FLASK_UPDATE_PROGRESS_STATUS = function(id,_status, errormessage){
  return new Promise((resolve,reject)=>{
      News.findByIdAndUpdate({_id:id},{
          $set:
          {
              // clusterinfo: _clusterinfo,
              // ptimestamp: _ptimestamp,
              // phrtimestamp: _phrtimestamp,
              errormessage:errormessage,
              status: _status
          }
      }).then(result=>{
          resolve(true)
      }).catch(err=>{
          winston.error("FLASK_UPDATE_PROGRESS_STATUS.catch::>>", err)
          reject({
              status:2,
              error:err,
              desc: `Unable to update progress status for ${id} `
          })
      })
  })
}


// GET_QUERY_DETAILS_FROM_MONGODB("5f06a2119ef9b627ea4ebdd4").then(function(result){
//   winston.info("resss", result)
// }).catch(function(err){
//   winston.error("eeee",err)
// })

// GET_QUERY_DETAILS_FROM_MONGODB("5ee1e391f1407365df7a3ade").then(result=>{
//     winston.info("result", result)
// }).catch(err=>{
//     winston.info("errrrrrrrrr", err)
// })


// db.casemodel.findOneAndUpdate(
//   {_id:ObjectId("5f03451b06e77f356ff8cd82")},
//   {
//     $set: {"lat":"1.34226872899395", "lng" : "103.707584773328"}
//   }
// )


// db.casemodel.findOneAndUpdate(
//   {_id:ObjectId("5efed153d6c4652fee676c1b")},
//   {
//     $set: {"lat":"1,304524512", "lng" : "103,9010428"}
//   }
// )
