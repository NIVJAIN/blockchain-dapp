import Web3 from "web3";
import { default as contract } from 'truffle-contract'
// import metaCoinArtifact from "../../build/contracts/MetaCoin.json";
import metaCoinArtifact from "../../build/contracts/SmartContract.json";
var PdfContract = contract(metaCoinArtifact);

const App = {
  web3: null,
  contractInstance: null,
  account: null,
  meta: null,
  start: async function() {
    const { web3 } = this;
    try {
    //  PdfContract.setProvider(new Web3.providers.HttpProvider('http://localhost:7545'));
      // get contract instance
      PdfContract.setProvider(web3.currentProvider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = metaCoinArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        metaCoinArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },
  register: async function(){
    // {username, emailid} = await validform();
    var username = document.forms["my-form"]["full-name"].value;
    var emailid = document.forms["my-form"]["email-address"].value;
    console.log("heheheheheheheeheheheheheheh", this.account)
    const { register } = this.meta.methods;
    console.log("resiger", register, username, emailid)
    const reg = await register(web3.utils.asciiToHex("sripal.jain@gmail.com"),web3.utils.asciiToHex("sripal")).send({gas: 140000, from: this.account})
    
    // await PdfContract.deployed().then(function(instance){
    //   console.log("instansssce", instance)
    // }).catch(function(err){
    //   console.log(err)
    // })
    console.log(reg)
    // console.log("sfasdf", await this.getInfo())
  }, 
  getInfo2: async function(){
    try {
      // await contract.methodCall();
      const { getInfo } = this.meta.methods;
      var email = this.web3.utils.asciiToHex("sripal.jain@gmail.com")
      // var info = await getInfo(this.web3.utils.asciiToHex("sripal.jain@gmail.com")).call();
      var info = await getInfo(email).call();
      var uname = await this.web3.utils.hexToAscii(info[0])
      var emailid = await this.web3.utils.hexToAscii(info[1])
      console.log("Info==================",uname, emailid)
      // alert(uname)

    } catch (error) {
      // error.reason now populated with an REVERT reason
      console.error("Failure reason", error);
    }
  },
} //App

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
    );
    // PdfContract.setProvider(new Web3.providers.HttpProvider('http://localhost:7545'));
  }
  // PdfContract.setProvider(App.web3.currentProvider);
  // var email = App.web3.utils.asciiToHex("sripal.jain@gmail.com")
  // PdfContract.deployed().then(function(instance){
  //   console.log("instance", instance)
  //   instance.getInfo(email).then(function(result){
  //     var uname =  App.web3.utils.hexToAscii(result[0])
  //     console.log("sfasfasfsfsfsfsafsdf===", uname)
  //   }).catch(function(err){
  //     console.log("PdfContract-------errir", err)
  //   })
  // }).catch(function(err){
  //   console.log("Instance.Error", err)
  // })
  App.start();
});






























// $( document ).ready(function() {
//   if (typeof web3 !== 'undefined') {
//     console.warn("Using web3 detected from external source like Metamask")
//     // Use Mist/MetaMask's provider
//     window.web3 = new Web3(web3.currentProvider);
//   } else {
//     console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
//     // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
//     window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
//   }

//   PdfContract.setProvider(web3.currentProvider);
//   var email = web3.utils.asciiToHex("sripal.jain@gmail.com")
//   PdfContract.deployed().then(function(instance){
//     console.log("instance", instance)
//     instance.getInfo(email).then(function(result){
//       var uname =  web3.utils.hexToAscii(result[0])
//       console.log("sfasfasfsfsfsfsafsdf===", uname)
//     }).catch(function(err){
//       console.log("PdfContract-------errir", err)
//     })
//   }).catch(function(err){
//     console.log("Instance.Error", err)
//   })

// });