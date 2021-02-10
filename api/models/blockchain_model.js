const Contract = require('../../middlewares/blockchain/Contract')
const Provider = require('../../middlewares/blockchain/provider')
const provider = new Provider()

const contract = new Contract()
const web3 = provider.web3
const instance = contract.initContract()
const mongoose = require("mongoose");
const path = require('path')
require('mongoose-long')(mongoose);
const db = require('../../database/mongodb')
var Long = mongoose.Schema.Types.Long;
const COLLETION_NAME = 'txn'
require('mongoose-long')(mongoose);
const crypto = require('crypto');
const fs = require('fs');
const { resolve } = require('path')
const hash = crypto.createHash('sha256');
var keccak256 = require('js-sha3').keccak256;


const fedupSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email :{type:String, required:true},
    name :{type:String, required:true},
    contractaddress :{type:String, required:true},
    // abi : {type:Array, "default":[]},
    regtxn: {type:Object, required:false},
    date: {type:Date, default: Date.now ,required:false},
    // tags: {type:Array, "default":[]},
},{ collection: COLLETION_NAME })
var TxnSchema = new mongoose.model('BucketSchema', fedupSchema)

const BLOCKCHAIN_CHECK_PDF_HASH = async(pdf_details)=>{
  return new Promise(async (resolve, reject) => {
    try {
      const accounts = await web3.eth.getAccounts();
      let _pdf_file_hash = await web3.utils.keccak256(pdf_details.file_buffer)
      var _email = web3.utils.asciiToHex(pdf_details.email)
      const {checkUserExistEmail,verifyPdfHash } = instance.methods;
      // _email = web3.utils.asciiToHex("niv.jain@gmail.com2")
      var userExistsTF = await checkUserExistEmail(_email).call();
      console.log("**************7878787", userExistsTF, _email)
      if(!userExistsTF) {
          console.log("iasdidaisfisfsidfsdf")
          throw new UserExceptionThrowObject(`Admin user ${pdf_details.email} doesnt exist in the chain`, {})
      } 
      var pdfExist = await verifyPdfHash(_email, _pdf_file_hash).call();
        if(pdfExist) {
          console.log("pdf alerady exits")
          throw new UserExceptionThrowObject(`This file ${pdf_details.pdf_filename} already exists in the chain check below table for history`, "get_pdf_details")        
        }else {
          resolve({
            result: "FileNotExist"
          })
        }
    } catch(error) {
      console.log("Errr", error)
        reject(error)
    }
  })
}

const CHECK_EMAIL = async (_email) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const { checkUserExistEmail } = instance.methods;
            const accounts = await web3.eth.getAccounts();
            email = web3.utils.asciiToHex(_email)
            var userExistsTF = await checkUserExistEmail(email).call();
            if(userExistsTF) {
                reject(`${_email} : This user already exists in the chain`)
                throw new UserExceptionThrowObject(`${_email} : This user already exists in the chain`, {})

            }
            resolve({
                result: `${_email} : This user donot exist in the system`,
            })
        } catch(err) {
            reject(err)
        }
    }) 
}

const REGISTER = async (_regdetails) => {
  return new Promise(async (resolve, reject) => {
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    // var _email = web3.utils.asciiToHex("niv.jain@gmail.com")
    // var _name = web3.utils.asciiToHex("nivjain")
    var _email = web3.utils.asciiToHex(_regdetails.email)
    var _name = web3.utils.asciiToHex(_regdetails.name)
    try {
        const { register, checkUserExistEmail } = instance.methods;
        var userExistsTF = await checkUserExistEmail(_email).call();
        if(userExistsTF) {
            // reject(`${_regdetails.email} : This user already exists in the chain`)
            throw new UserExceptionThrowObject(`${_regdetails.email} This user already exists in the chain`, {})

        }
        console.log("This showuld not show in console....")
        const reg = await register(_email,_name).send({gas: 140000, from: account})
        resolve({
          result: reg
        })
    } catch (error){
        console.log("Register:Error", error)
        reject(error)
    }
  })
}


const PDF_TXN = async (_pdf_txn_details) => {
  return new Promise(async (resolve, reject) => {
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    console.log("pdfgradsfasfadsfdsafdsafdsf", _pdf_txn_details)
    // var _email = web3.utils.asciiToHex(_pdf_txn_details.email);
    var _email = web3.utils.asciiToHex(_pdf_txn_details.email);
    var _cname = web3.utils.asciiToHex(_pdf_txn_details.companyname);
    var _cemail = web3.utils.asciiToHex(_pdf_txn_details.companyemail);
    var _pdf_filename = _pdf_txn_details.pdf_filename;
    // var _pdf_filename_bytes = web3.utils.asciiToHex(_pdf_txn_details.pdf_filename);
    var _date = web3.utils.asciiToHex(_pdf_txn_details.date);
    var _pdf_hash = "";
    // var _name = web3.utils.asciiToHex(_pdf_txn_details.name)
    try {
        const { addPdfTxn, checkUserExistEmail,verifyPdfHash } = instance.methods;
        var userExistsTF = await checkUserExistEmail(_email).call();
        if(!userExistsTF) {
            throw new UserExceptionThrowObject(`Admin user ${_pdf_txn_details.email} doesnt exist in the chain`, {})
        }
        hashed = await internal_hash_pdf_file(_pdf_txn_details.pdf_filename)
        var hashOfTheFile =  hashed
        _pdf_hash = new String(hashOfTheFile);
        _pdf_file_hash = _pdf_hash.valueOf();
        var pdfExist = await verifyPdfHash(_email, _pdf_file_hash).call();
        if(pdfExist) {
          let get_pdf_details = await internal_pdf_get_details(_pdf_txn_details)
          console.log("pdf alerady exits", get_pdf_details)
          fs.unlinkSync(path.join(__dirname , `../../uploaded/${_pdf_txn_details.pdf_filename}`));
          throw new UserExceptionThrowObject(`This file ${_pdf_txn_details.pdf_filename} already exists in the chain check below table for history`, get_pdf_details)
        }
        const blockchainTxnResults = await addPdfTxn(_email,_cname,_cemail,_pdf_filename,_pdf_hash.valueOf(),_date).send({gas: 640000, from: account})
        if(blockchainTxnResults.transactionHash != null || blockchainTxnResults.transactionHash != "" ){
          console.log(blockchainTxnResults)
          blockchainTxnResults.pdfHash = _pdf_file_hash
        }
        var blockchain_response = {};
        blockchain_response.transactionHash = blockchainTxnResults.transactionHash;
        blockchain_response.blockHash = blockchainTxnResults.blockHash;
        blockchain_response.blockNumber = blockchainTxnResults.blockNumber;
        blockchain_response.EthAddress = blockchainTxnResults.from;
        blockchain_response.ContractAddress = blockchainTxnResults.to;
        blockchain_response.gasUsed = blockchainTxnResults.gasUsed;
        blockchain_response.cumulativeGasUsed = blockchainTxnResults.cumulativeGasUsed;
        blockchain_response.pdfHash = blockchainTxnResults.pdfHash
        blockchain_response.pdf_filename = _pdf_filename
        resolve({ 
          result:blockchain_response
        })
    } catch (error){
        console.log("Register:>rror", error)
        if(error.message){
          console.log("iam error.message.called")
          // console.log("error.message->Print", error.info)
          reject(error)
          // reject(error.message)
        } else {
          console.log("just error.called")
          reject(error)
        }
        
    }
  })
}

const UserExceptionThrowObject = function(message, objectData) {
  this.message = message;
  this.info = objectData;
}

const FOO_HASH_TXN = async (_pdf_hash) => {
  return new Promise(async (resolve, reject) => {
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    try {
        const { sendFoo, checkUserExistEmail } = instance.methods;
        hashed = await internal_hash_pdf_file(_pdf_hash.pdf_filename)
        // var hashFoo = "0x341f85f5eca6304166fcfb6f591d49f6019f23fa39be0615e6417da06bf747ce";
        var fileHash = hashed;
        var fileFooObj = new String(fileHash);
        const foo = await sendFoo(fileFooObj.valueOf()).send({gas: 140000, from: account})
        _pdf_hash.hashed = hashed
        resolve({result: foo})
    } catch (error){
        console.log("Register:Error", error)
        reject(error)
    }
  })
}


const GET_PDF_LIST = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      var _email = web3.utils.asciiToHex("niv.jain@gmail.com");
      const { getPDFList } = instance.methods;
      const pdf_list = await getPDFList(_email).call();
      console.log(pdf_list)
      resolve({
        result: pdf_list
      })
    } catch (err) {
      console.log("Error", err)
      res.status(500).json({error:err})
    }
  })
}


const BLOCKCHAIN_GET_PDF_DETAILS = async (query_details)=> {
  return new Promise(async (resolve, reject) => {
    try {
      let pdf_details = await internal_pdf_get_details(query_details)
      // console.log("GET_PDF_DETAILS", pdf_details)
      resolve({
        result: pdf_details
      })
    } catch (err) {
      console.log("Error", err)
      reject(err)
    }
  })
}


const internal_pdf_get_details = async (query_details)=>{
  return new Promise(async (resolve, reject) => {
    try {
      var _email = web3.utils.asciiToHex(query_details.email);
      var _pdf_filename = query_details.pdf_filename
      const { getCompanyDetails } = instance.methods;

      hashed = await internal_hash_pdf_file(query_details.pdf_filename)
      var hashOfTheFile =  hashed
      _pdf_hash = new String(hashOfTheFile);
      _pdf_file_hash = _pdf_hash.valueOf();

      const pdf_list = await getCompanyDetails(_email, _pdf_file_hash).call();
      // bytes32,bytes32,string memory,bytes32,bytes32,bytes32
      console.log(pdf_list)
      var blockchain_response = {};
      blockchain_response.companyName = web3.utils.hexToAscii(pdf_list[0]).replace(/\u0000/g, '')
      blockchain_response.companyEmail = web3.utils.hexToAscii(pdf_list[1]).replace(/\u0000/g, '')
      blockchain_response.pdf_filename = pdf_list[2]
      // blockchain_response.pdf_filename_bytes = web3.utils.hexToAscii(pdf_list[3]).replace(/\u0000/g, '')
      blockchain_response.date = web3.utils.hexToAscii(pdf_list[3]).replace(/\u0000/g, '')
      blockchain_response.pdf_hash = pdf_list[4]
      // console.log(blockchain_response)
      resolve(blockchain_response)
    } catch (err) {
      console.log("Error", err)
      reject(err)
      // res.status(500).json({error:err})
    }
  })
}
const GET_FOO_HASH = async () => {
  return new Promise(async (resolve, reject) => {
    try {
        const { getFoo } = instance.methods;
        const getHASH =  await getFoo().call();
        let aa = internal_hash_pdf_file("apple.pdf")
        resolve({
          result: getHASH
        })
    } catch (error){
        console.log("Register:Error", error)
        reject(error)
    }
  })
}

const SAVE_BLK_CHAIN_REGISTER_DETAILS_IN_MONGODB = async (regTxnInfo) => {
  return new Promise((resolve,reject)=>{
    var saveTxnInfo = new TxnSchema({
      _id: new mongoose.Types.ObjectId(),
      email: regTxnInfo.email,
      name: regTxnInfo.name,
      contractaddress: regTxnInfo.regtxn.to,
    //   abi: contract.abi,
      regtxn: regTxnInfo.regtxn,

    //   tags : regTxnInfo.tags
    })
    saveTxnInfo.save().then(function(result){
      resolve({
        message: "success",
        mongoresult: result
      })
    }).catch(function(err){
      console.log("eere",err)
      reject({
        error: "Unable to save bucketinfo try again later"
      })
    })

  })
}

const GET_PDF_FILE_HASH = async (query_details)=>{
  return new Promise(async (resolve, reject) => {
    try {
      hashed = await internal_hash_pdf_file(query_details.pdf_filename)
      var hashOfTheFile =  hashed
      _pdf_hash = new String(hashOfTheFile);
      _pdf_file_hash = _pdf_hash.valueOf()
      resolve({
        result: _pdf_file_hash
      })
    } catch (err) {
      console.log("Error", err)
      reject(err)
      // res.status(500).json({error:err})
    }
  })
}

const get_hash_of_file = async (_file_name) =>{
  return new Promise((resolve,reject)=>{
    try {
      var filedetails = {}
      let file_buffer = fs.readFileSync(path.join(__dirname,  '`uploaded/${_file_name}`'));
      hash.update(file_buffer);
      const hex = hash.digest('hex');
      var ascii2hex = web3.utils.asciiToHex(hex)
      filedetails.filehash = hex;
      filedetails.ascii2hex = ascii2hex;
      resolve({
        result: filedetails
      })
    } catch(error){
      console.log("get_hash_of_file.Error", error)
      reject(error)
    }
  })
}

const internal_hash_pdf_file = async (_file_name) =>{
  return new Promise((resolve,reject) =>{
    try {
      console.log("hasdasfsafsdafdsafsdfsf", _file_name)
      // resolve(_file_name)
      var file_path = path.join(__dirname, `../../uploaded/${_file_name}`)
      if (!fs.existsSync(file_path)) {
        reject("PDF file donot exist in the system")
        // throw new UserExceptionThrowObject(`Admin user ${_file_name} doesnt exist in repo`, {})
      }
      let file_buffer = fs.readFileSync(file_path);
      let hashFile = web3.utils.keccak256(file_buffer)
      console.log("hasged", hashFile)
      resolve(hashFile)
      // hashedData = web3.utils.sha3(JSON.stringify(file_buffer)); // different value using json stringify
      // hashedData = web3.utils.sha3(file_buffer); //same as resolve(web3.utils.keccak256(file_buffer))
      // resolve(hashedData)
    } catch(err) {
      console.log(err)
      reject(err)
    }
  })
}


module.exports = {
    REGISTER,
    // GET_INFO,
    CHECK_EMAIL,
    SAVE_BLK_CHAIN_REGISTER_DETAILS_IN_MONGODB,
    PDF_TXN,
    FOO_HASH_TXN,
    GET_FOO_HASH,
    GET_PDF_LIST,
    BLOCKCHAIN_GET_PDF_DETAILS,
    GET_PDF_FILE_HASH,
    BLOCKCHAIN_CHECK_PDF_HASH,
}



// const GET_INFO = (_email) =>{
//     return new Promise((resolve, reject) => {
//         MetaCoinContract.deployed().then(function(instance) {
//             // return instance.getBalance.call('0x13a0674c16f6a5789bff26188c63422a764d9a39', {from: '0x13a0674c16f6a5789bff26188c63422a764d9a39'})
//             // var email = web3.utils.asciiToHex("sripal.jain@gmail.com")
//             var email = web3.utils.asciiToHex(_email)
//             return instance.getInfo.call(email)
//         }).then(function(result) {
//             console.table([result[0],result[1]])
//             console.log(web3.utils.hexToAscii(result[0]));
//             console.log(web3.utils.hexToAscii(result[1]));
//             return resolve({
//                 emailid: web3.utils.hexToAscii(result[0]).replace(/\u0000/g, ''),
//                 name : web3.utils.hexToAscii(result[1]).replace(/\u0000/g, '')
//             })
//         }).catch(function(err){
//             console.log("error..",err)
//             return reject({
//                 error: err
//             })
//         })
//     }) 
// }


// const hashFile = async (_file_name) =>{
//   return new Promise(resolve,reject =>{
//     try {
//       var file_buffer = fs.readFileSync(_file_name);
//       // console.log("##############################");
//       // console.log(file_buffer);
//       // console.log("##############################");
//       // console.log(file_buffer.toString('base64'));
//       // console.log("##############################");
//       // resolve(keccak256(file_buffer.toString()))
//       resolve(web3.utils.keccak256(file_buffer))
//     } catch(err) {
//       console.log(err)
//       reject(err)
//     }
//   })
// }




