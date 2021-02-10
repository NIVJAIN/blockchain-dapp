// const ConvertLib = artifacts.require("ConvertLib");
// const SmartContract = artifacts.require("SmartContract");

// module.exports = function(deployer) {
//   deployer.deploy(ConvertLib);
//   deployer.link(ConvertLib, SmartContract);
//   deployer.deploy(SmartContract);
// };

// const Registration = artifacts.require('Registration')
const SmartContract = artifacts.require("SmartContract");
const fs = require('fs')
var fse = require('fs-extra');
const path = require('path')
const moment = require('moment')
// const path = '/../src/Metadata.js'
// const path = '../../../api/middlewares/blockchain/metadata.js'
const fpath = path.join(__dirname, '../middlewares/blockchain/metadata.js');
var filelocation = '../middlewares/blockchain'
if (fs.existsSync(fpath)) {
  fse.copySync(path.resolve(__dirname ,'../middlewares/blockchain/metadata.js'), `${filelocation}/${moment().format("DD-MMM-YYYY-HHmmss")}-metada.js`);
}


module.exports = function (deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(SmartContract).then(() => {
  // fse.copySync(path.resolve(__dirname ,'../middlewares/blockchain/metadata.js'), `${filelocation}/${moment().format("DD-MM-YYY-HHmmss")}.metada.js`);
    fs.writeFile(
      // __dirname + fpath,
      fpath,
      'const ADDRESS = ' + "'" + SmartContract.address + "';",
      (err) => {
        if (err) {
          console.log(err)
        } else {
        }
      },
    )

    fs.appendFile(
      // __dirname + path,
      fpath,
      '\nconst ABI = ' + JSON.stringify(SmartContract.abi) + ';',
      (err) => {
        if (err) {
          console.log(err)
        } else {
          fs.appendFile(
            // __dirname + path,
            fpath,
            '\nmodule.exports = { ADDRESS, ABI };',
            (err) => {
              if (err) {
                console.log(err)
              }
            },
          )
        }
      },
    )
  })
}