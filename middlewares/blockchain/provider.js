const Web3 = require('web3')

class  Provider {
  constructor() {
    //setup web3 provider
    try {
      this.web3 = new Web3(
        new Web3.providers.HttpProvider('http://localhost:7545'),
      )
    }catch (error){
      console.log("sdcdsfsfsdfsdfdsfsdfsdfsdf",error)
    }
  }
  async check_eth_connection(){
    Promise.race([
        this.web3.eth.net.isListening(),
        new Promise(function(resolve, reject) {
            setTimeout(function() {
                reject("Time out");
                console.log("TIMeput ")
            }, 10e3);
        })
    ]);
  }
}

module.exports = Provider