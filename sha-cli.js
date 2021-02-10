// sha-cli.js
const filename = process.argv[2];
const Provider = require('./middlewares/blockchain/provider')
const provider = new Provider()
const web3 = provider.web3
const crypto = require('crypto');
const fs = require('fs');
const hash = crypto.createHash('sha256');
var keccak256 = require('js-sha3').keccak256;
// const input = fs.createReadStream(filename);
// input.on('readable', () => {
//   const data = input.read();
//   if (data)
//     hash.update(data);
//   else {
//     console.log(`${hash.digest('hex')} ${filename}`);
//   }
// });


let file_buffer = fs.readFileSync(filename);
let kec = web3.utils.keccak256(file_buffer)
let kec2 = keccak256(file_buffer) 
let sum = crypto.createHash('sha256');
sum.update(file_buffer);
const hex = sum.digest('hex');
console.log(hex, kec, kec2);


// var dd = web3.utils.asciiToHex(hex)
// console.log("dd", dd)
// var gg = web3.utils.hexToAscii(dd).replace(/\u0000/g, '')
// console.log("hextoascii", gg)
// console.log(hex);


// var jain = web3.utils.asciiToHex("sripaljain@gmail.com")
// console.log("jain", jain)
// // var jain2 = web3.utils.hexToAscii(jain).replace(/\u0000/g, '')
// var jain2 = web3.utils.hexToAscii(jain)
// console.log("jain2", jain2)