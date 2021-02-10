const mongoose = require('mongoose');
const COLLETION_NAME = 'news'
// const winston = require('../../config/logfive')
// const rp = require('request-promise')
require('mongoose-long')(mongoose);
var Long = mongoose.Schema.Types.Long;
const fedupSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // pin: {type:String, required:true,unique: true},
    email: {type:String, required:true},
    q: {type:String, required:true},
    qtimestamp:{type: Long, required:false},
    qhrtimestamp:{type:String, required:false},
    querytype: {type:String, required:false},
    status: {type:String, required:false},
    totalresults: {type:String, required:false},
    from: {type:String, required:false},
    to: {type:String, required:false},
    // articles:{type:Array, "default":[]},
    articles:{type:Object, required:false},
    pastday: {type: Long, required:false},
    language: {type:String, required:false},
    pagelimit: {type: Long, required:false},
    sortby: {type:String, required:false},
    timeofquery: {type:String, required:false},
    ntimestamp:{type: Long, required:false},
    nhrtimestamp:{type:String, required:false},
    numofarticles:{type:String, required:false},
    numofclusters:{type:String, required:false},
    s3:{type:String, required:false},
    s3cluster:{type:String, required:false},
    // clusterinfo:{type:String, required:false},
    clusterinfo:{type:Object, required:false},
    ptimestamp:{type: Long, required:false},
    phrtimestamp:{type:String, required:false},
    errormessage:{type:String, required:false},
    date: {type:Date, default: Date.now ,required:false},


    // pcode: {type:String, required:false},
    // timestamp:{type: Long, required:false},
    // hrtimestamp:{type:String, required:false},
    // date: {type:Date, default: Date.now ,required:false},
    // another: {type:Date},
    // updatetrk:{type:Array, "default":[]},
    // responder:{type:String, required:false},
    // status:{type:String, required:false},
},{ collection: COLLETION_NAME })

module.exports = mongoose.model('News', fedupSchema)