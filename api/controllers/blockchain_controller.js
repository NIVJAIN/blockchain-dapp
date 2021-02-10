const mongoose = require("mongoose");
const blockchain_model = require('../models/blockchain_model')
// const send_email = require('../middleware/send-email')

// const mailOptions = {
//   from: 'ngpblockchain@gmail.com', // sender address
//   to: 'sripal.jain@gmail.com', // list of receivers
//   subject: 'Subject of your email', // Subject line
//   html: '<p>Your html here</p>',// plain text body
//   // attachments: [{'filename': 'attachment.txt', 'content': data}]
// };

// send_email.SEND_EMAIL(mailOptions).then(function(result){
//   console.log("result", result)
// }).catch(function(err){
//   console.log("err", err)
// })


const CHECK = ((req,res,next)=>{
    res.status(200).json({
      message: "Check Passed v1"
    })
})


const CHECK_EMAIL = async (req,res,next)=>{
  var email = req.params.email
  try {
    checkBucketExist = await blockchain_model.CHECK_EMAIL(email);
    res.status(200).json(checkBucketExist)
  } catch (err) {
    res.status(500).json(err)
  }
}

const REGISTER = async (req,res,next)=>{
  var _reg_details = {};
  _reg_details.name = req.body.name;
  _reg_details.email = req.body.email;
  try {
    regtxn = await blockchain_model.REGISTER(_reg_details);
    regtxn.logsBloom = ""
    if(regtxn) {
      _reg_details.regtxn = regtxn
      saveIntoDB = await blockchain_model.SAVE_BLK_CHAIN_REGISTER_DETAILS_IN_MONGODB(_reg_details)
    }
    res.status(200).json(saveIntoDB)
        // res.status(200).json({message:_reg_details})
  } catch (err) {
    res.status(500).json(err)
  }
}

// addPdfTxn(bytes32 _email, bytes32 _cname, bytes32 _cemail,string memory _pdf_filename,bytes32 _pdf_filename_bytes, bytes32 _date)
const PDF_TXN = async (req,res,next)=>{
  try {
    var _pdf_txn_details = {};
    _pdf_txn_details.email = req.body.email;
    _pdf_txn_details.companyname = req.body.companyname;
    _pdf_txn_details.companyemail = req.body.companyemail;
    _pdf_txn_details.pdf_filename = req.body.pdf_filename;
    _pdf_txn_details.pdf_filename_bytes = ""
    _pdf_txn_details.date = Date.now().toString();
    console.log("PDF_TXN ==>>",_pdf_txn_details)
    let txn_details = await blockchain_model.PDF_TXN(_pdf_txn_details)
    console.log("txn_details==>> ", txn_details)
    // var blockchain_response = {};
    // // transactionHash: '0xe8139e1172c9aaa864335a3e28712adbd1db3fc41fa93d47c584b556fa17ea8d',
    // // transactionIndex: 0,
    // // blockHash: '0x30f889ec6ef3e1580543baccb63f71b5e800de8725466604e20b61f1056c3436',
    // // blockNumber: 165,
    // // from: '0x14f4407f69f7be11a4dbfc1f87ea2f10abb22b0b',
    // // to: '0xf3d8948fa0901a3bddc46b34d2847aef43308ca2',
    // // gasUsed: 183675,
    // // cumulativeGasUsed: 183675,
    // blockchain_response.transactionHash = txn_details.result.transactionHash;
    // blockchain_response.blockHash = txn_details.result.blockHash;
    // blockchain_response.blockNumber = txn_details.result.blockNumber;
    // blockchain_response.EthAddress = txn_details.result.from;
    // blockchain_response.ContractAddress = txn_details.result.to;
    // blockchain_response.gasUsed = txn_details.result.gasUsed;
    // blockchain_response.cumulativeGasUsed = txn_details.result.cumulativeGasUsed;
    // blockchain_response.pdfHash = txn_details.result.pdfHash

    res.status(200).json(txn_details)
  } catch (err) {
    console.log("PDDD", err)
    console.log(typeof err)
    // res.status(500).json({error:err.message})
    res.status(500).json(err)
  }
}

const GET_PDF_LIST = async (req,res,next)=>{
  try {
    pdf_list = await blockchain_model.GET_PDF_LIST();
    res.status(200).json({pdf_list})
  } catch (err) {
    res.status(500).json(err)
  }
}

const FOO_HASH_TXN = async (req,res,next)=>{
  var _pdf_hash = {};
  _pdf_hash.pdf_filename = req.body.pdf_filename;
  try {
    regtxn = await blockchain_model.FOO_HASH_TXN(_pdf_hash);
    res.status(200).json(regtxn)
  } catch (err) {
    res.status(500).json(err)
  }
}
const GET_FOO_HASH = async (req,res,next)=>{
  try {
    // res.status(200).json({message: "dsfsdfdsfs"})
    gethash = await blockchain_model.GET_FOO_HASH();
    res.status(200).json(gethash)
  } catch (err) {
    res.status(500).json(err)
  }
}

const BLOCKCHAIN_CHECK_PDF_HASH = async  (req,res,next)=>{
  try {
    console.log("hiii ",req.file)
    if (!req.file) {
      return res.status(500).json({
          error: "No file to upload"
      })
    }
    var pdf_details = {
      pdf_filename : req.file.originalname,
      file_buffer: req.file.buffer,
      email : req.body.email
    }
    var file_buffer = req.file.buffer
    gethash = await blockchain_model.BLOCKCHAIN_CHECK_PDF_HASH(pdf_details);
    res.status(200).json(gethash)
  } catch (err) {
    res.status(500).json(err)
  }
}

const BLOCKCHAIN_GET_PDF_DETAILS = async (req,res,next)=>{
  try {
    var query_details = {}
    query_details.email = req.body.email;
    query_details.pdf_filename = req.body.pdf_filename
    gethash = await blockchain_model.BLOCKCHAIN_GET_PDF_DETAILS(query_details);
    res.status(200).json(gethash)
  } catch (err) {
    res.status(500).json(err)
  }
}

const GET_PDF_FILE_HASH = async (req,res,next)=>{
  try {
    var query_details = {}
    query_details.pdf_filename = req.body.pdf_filename
    gethash = await blockchain_model.GET_PDF_FILE_HASH(query_details);
    res.status(200).json(gethash)
  } catch (err) {
    res.status(500).json(err)
  }
}

module.exports = {
  CHECK,
  REGISTER,
//   GET_INFO,
  CHECK_EMAIL,
  PDF_TXN,
  FOO_HASH_TXN,
  GET_FOO_HASH,
  GET_PDF_LIST,
  BLOCKCHAIN_GET_PDF_DETAILS,
  GET_PDF_FILE_HASH,
  BLOCKCHAIN_CHECK_PDF_HASH,

}


// const GET_INFO = async (req,res,next)=>{
//   var email = req.params.email
//   try {
//     getInfoViaBlockchain = await blockchain_model.GET_INFO(email);
//     res.status(200).json({message:getInfoViaBlockchain})
//   } catch (err) {
//     console.log("Error", err)
//     res.status(500).json({error:err})
//   }
// }