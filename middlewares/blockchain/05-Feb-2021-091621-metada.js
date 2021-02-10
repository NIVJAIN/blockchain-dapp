const ADDRESS = '0xf3D8948Fa0901a3bDdC46B34d2847aEF43308cA2';
const ABI = [{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"EMAIL_LIST","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xde15d64a"},{"constant":true,"inputs":[],"name":"fooStore","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x261f9617"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"usersMap","outputs":[{"internalType":"bytes32","name":"uEmail","type":"bytes32"},{"internalType":"bytes32","name":"uName","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf0b822e0"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"_email","type":"bytes32"}],"name":"checkUserExistEmail","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xe1732e30"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"_email","type":"bytes32"},{"internalType":"bytes32","name":"_pdf_hash","type":"bytes32"}],"name":"verifyPdfHash","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xb9d52f9c"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"_email","type":"bytes32"},{"internalType":"bytes32","name":"_name","type":"bytes32"}],"name":"register","outputs":[{"internalType":"bool","name":"exists","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x2f926732"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"_email","type":"bytes32"}],"name":"getInfo","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x7a02dc06"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"_email","type":"bytes32"},{"internalType":"bytes32","name":"_cname","type":"bytes32"},{"internalType":"bytes32","name":"_cemail","type":"bytes32"},{"internalType":"string","name":"_pdf_filename","type":"string"},{"internalType":"bytes32","name":"_pdf_hash","type":"bytes32"},{"internalType":"bytes32","name":"_date","type":"bytes32"}],"name":"addPdfTxn","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xd5bc10e4"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"_email","type":"bytes32"}],"name":"getPDFList","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x7a66db9a"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"_email","type":"bytes32"}],"name":"getPdfHashes","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x6a535344"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"_email","type":"bytes32"},{"internalType":"bytes32","name":"_pdf_hash","type":"bytes32"}],"name":"getCompanyDetails","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"string","name":"","type":"string"},{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x4e0829f5"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"foo","type":"bytes32"}],"name":"sendFoo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x642d8277"},{"constant":true,"inputs":[],"name":"getFoo","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x243dc8da"}];
module.exports = { ADDRESS, ABI };