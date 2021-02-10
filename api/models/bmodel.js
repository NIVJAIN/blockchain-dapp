var Web3 = require('web3'),
  contract = require("truffle-contract"),
  path = require('path')
const mongoose = require("mongoose");
require('mongoose-long')(mongoose);
// const db = require('../../db/mongodb')
var Long = mongoose.Schema.Types.Long;
const { response } = require("express");
var web3 = new Web3();
MetaCoin    = require(path.join(__dirname, '../../build/contracts/SmartContract.json'));
// var web3 = new Web3(new Web3.providers.HttpProvider('http://vitalikbuterin.southeastasia.cloudapp.azure.com:8544'));
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
var provider    = new Web3.providers.HttpProvider("http://localhost:7545"),    
    filePath    = path.join(__dirname, '../../build/contracts/SmartContract.json');
var MetaCoinContract = contract(MetaCoin);
MetaCoinContract.setProvider(provider);

// MetaCoinContract.deployed().then(function(instance) {
//     // return instance.getBalance.call('0x13a0674c16f6a5789bff26188c63422a764d9a39', {from: '0x13a0674c16f6a5789bff26188c63422a764d9a39'})
//     var email = web3.utils.asciiToHex("sripal.jain@gmail.com")
//     return instance.getInfo.call(email)
// }).then(function(result) {
//     console.table([result[0],result[1]])
//     console.log(web3.utils.hexToAscii(result[0]));
//     console.log(web3.utils.hexToAscii(result[1]));
// }, function(error) {
//     console.log(error);
// }); 

// const COLLETION_NAME = 'bucket'
// require('mongoose-long')(mongoose);
// var Long = mongoose.Schema.Types.Long;
// const fedupSchema = mongoose.Schema({
//     _id: mongoose.Schema.Types.ObjectId,
//     cognito_username :{type:String, required:false},
//     bucket_name: {type:String, required:true},
//     date: {type:Date, default: Date.now ,required:false},
//     tags: {type:Array, "default":[]},
// },{ collection: COLLETION_NAME })
// var BucketSchema = new mongoose.model('BucketSchema', fedupSchema)

const REGISTER = async (_regdetails) => {
  return new Promise(async (resolve, reject) => {
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    var _email = web3.utils.asciiToHex("niv.jain@gmail.com")
    var name = web3.utils.asciiToHex("nivjain")
    var meta = null;
    // const reg = await register(web3.utils.asciiToHex("sripal.jain@gmail.com"),web3.utils.asciiToHex("sripal")).send({gas: 140000, from: this.account})
    MetaCoinContract.deployed().then(async function(instance) {
        // var email = web3.utils.asciiToHex("sripal.jain@gmail.com")
        meta = instance
        return instance.checkUserExistEmail(_email)
    }).then(function(result){
        console.log(result)
        if(result) {
            console.log("sdfsd", result[0])
        }
        return result
        // return instance.register(_email,name,{gas: 140000, from: account})
    }).then(function(result){
        console.log("feesss", result)
        return resolve({
            result
        })
    }).catch(function(err){
        return reject({
            error: err
        })
    })

  })
}
const GET_INFO = (_email) =>{
    return new Promise((resolve, reject) => {
        MetaCoinContract.deployed().then(function(instance) {
            // return instance.getBalance.call('0x13a0674c16f6a5789bff26188c63422a764d9a39', {from: '0x13a0674c16f6a5789bff26188c63422a764d9a39'})
            // var email = web3.utils.asciiToHex("sripal.jain@gmail.com")
            var email = web3.utils.asciiToHex(_email)
            return instance.getInfo.call(email)
        }).then(function(result) {
            console.table([result[0],result[1]])
            console.log(web3.utils.hexToAscii(result[0]));
            console.log(web3.utils.hexToAscii(result[1]));
            return resolve({
                emailid: web3.utils.hexToAscii(result[0]).replace(/\u0000/g, ''),
                name : web3.utils.hexToAscii(result[1]).replace(/\u0000/g, '')
            })
        }).catch(function(err){
            console.log("error..",err)
            return reject({
                error: err
            })
        })
    }) 
}



module.exports = {
    REGISTER,
    GET_INFO,
}
