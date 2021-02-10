// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract'
import metaCoinArtifact from "../../build/contracts/SmartContract.json";
var web3 = await new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
var PdfContract = contract(metaCoinArtifact);

window.App = {
    //0xed8431e859c41745fd3fede211c4a2a8ee5562d8
    //http://ngpblkioyb4p.southeastasia.cloudapp.azure.com:8545/
    start: function () {
      var self = this;
      console.log("SettingUpProvider")
      PdfContract.setProvider(new Web3.providers.HttpProvider('http://localhost:7545'));
  
      // Get the initial account balance so it can be displayed.
      web3.eth.getAccounts(function (err, accs) {
        if (err != null) {
          alert("There was an error fetching your accounts.");
          return;
        }
  
        if (accs.length == 0) {
          alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
          return;
        }
      });
    },

  };

  window.addEventListener('load', function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 CoffeeCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
      var provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545')
    } else {
      console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
      window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));  
      PdfContract.setProvider(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
    }
    PdfContract.setProvider(provider)
    App.start();
    //App.register();
  });