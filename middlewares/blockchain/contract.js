
const Provider = require('./provider')
const provider = new Provider()
const { ADDRESS, ABI } = require('./metadata')

class Contract {
  constructor() {
    this.web3 = provider.web3
    this.abi = ABI
  }
  // create contract instance
  initContract() {
    try {
      const instance = new this.web3.eth.Contract(ABI, ADDRESS)
      return instance
    } catch(error){
      console.log("Conract..", error)
    }
  }
}

module.exports = Contract


// const Provider = require('./Provider')
// const provider = new Provider()
// const path = require('path')
// // const { ADDRESS, ABI } = require('./Metadata')
// const metaCoinArtifact = require(path.join(__dirname, '../../../build/contracts/SmartContract.json'));


// class Contract {
//   constructor() {
//     this.web3 = provider.web3
//   }
//   // create contract instance
//   async initContract() {
//     const networkId = await this.web3.eth.net.getId();
//     const deployedNetwork = metaCoinArtifact.networks[networkId];
//     const instance = new this.web3.eth.Contract(metaCoinArtifact.abi, deployedNetwork.address)
//     return instance
//   }
// }

// module.exports = Contract


// const Provider = require('./Provider')
// const provider = new Provider()
// const { ADDRESS, ABI } = require('./Metadata')

// class Contract {
//   constructor() {
//     this.web3 = provider.web3
//   }
//   // create contract instance
//   initContract() {
//     const instance = new this.web3.eth.Contract(ABI, ADDRESS)
//     return instance
//   }
// }

// module.exports = Contract