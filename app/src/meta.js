import Web3 from "web3";
import { default as contract } from 'truffle-contract'
// import metaCoinArtifact from "../../build/contracts/MetaCoin.json";
import metaCoinArtifact from "../../build/contracts/SmartContract.json";
var PdfContract = contract(metaCoinArtifact);
// var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

const App = {
  web3: null,
  contractInstance: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = metaCoinArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        metaCoinArtifact.abi,
        deployedNetwork.address,
      );
      PdfContract.setProvider(new Web3.providers.HttpProvider('http://localhost:7545'));
      // PdfContract.setProvider(new Web3.providers.HttpProvider('http://localhost:7545'));
      // await PdfContract.deployed().then(function(instance){
      //   console.log("instansssce", instance)
      //   this.contractInstance = instance
      // }).catch(function(err){
      //   console.log("PdfContract.Error",err)
      // })
      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      // console.log("this", this.account, accounts[1],accounts[2], this.meta)
      // this.refreshBalance();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  start2: async function () {
    var self = this;
    // console.log("UnlockingMainAccount-Debug0")
    // console.log("UnlockingMainAccount-Debug1: ", web3.personal.unlockAccount(web3.eth.accounts[0], configjson.ethPassword));
    console.log("SettingUpProvider")
    await PdfContract.setProvider(new Web3.providers.HttpProvider('http://localhost:7545'));
    // Get the initial account balance so it can be displayed.
          const networkId = await web3.eth.net.getId();
      const deployedNetwork = metaCoinArtifact.networks[networkId];
        this.meta = new web3.eth.Contract(
        metaCoinArtifact.abi,
        deployedNetwork.address,
      );
    await web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
    });
   console.log("Contractt", PdfContract)
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

  getInfo: async function(){
    console.log("*******************************************************")
    // const { getInfo } = this.meta.methods;
    // var email = this.web3.utils.asciiToHex("sripal.jain@gmail.com")
    // // var info = await getInfo(this.web3.utils.asciiToHex("sripal.jain@gmail.com")).call();
    // var info = await getInfo(email).call();
    // var uname = await this.web3.utils.hexToAscii(info[0])
    // var emailid = await this.web3.utils.hexToAscii(info[1])
    
    // console.log("Info==================",uname, emailid)
    var email = this.web3.utils.asciiToHex("sripal.jain@gmail.com")
    PdfContract.deployed().then(function(instance){
      // console.log("instance", instance)
      instance.getInfo(email).then(function(result){
      var uname =  this.web3.utils.hexToAscii(result[0])
      console.log("germany germany germany germany germany ===", uname)
    }).catch(function(err){
      console.log("PdfContract-------errir", err)
    })
    }).catch(function(err){
      console.log("Instance.Error", err)
    })
  },



};

// function ConvertHexToAscii(result){
//   var output = {};
//   return new Promise((resolve,reject)=>{
//     for(i=0; i<result.length; i++){

//     }
//   })
// }

function validform() {

  var a = document.forms["my-form"]["full-name"].value;
  var b = document.forms["my-form"]["email-address"].value;
  // var c = document.forms["my-form"]["username"].value;
  // var d = document.forms["my-form"]["permanent-address"].value;
  // var e = document.forms["my-form"]["nid-number"].value;

  if (a==null || a=="")
  {
      alert("Please Enter Your Full Name");
      return false;
  }else if (b==null || b=="")
  {
      alert("Please Enter Your Email Address");
      return false;
  }
  // else if (c==null || c=="")
  // {
  //     alert("Please Enter Your Username");
  //     return false;
  // }else if (d==null || d=="")
  // {
  //     alert("Please Enter Your Permanent Address");
  //     return false;
  // }else if (e==null || e=="")
  // {
  //     alert("Please Enter Your NID Number");
  //     return false;
  // }
  return a, b;

}
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
    var email = App.web3.utils.asciiToHex("sripal.jain@gmail.com")
    PdfContract.setProvider(App.web3.currentProvider);
    PdfContract.deployed().then(function(instance){
      console.log("instance", instance)
      instance.getInfo(email).then(function(result){
        var uname =  App.web3.utils.hexToAscii(result[0])
        console.log("sfasfasfsfsfsfsafsdf===", uname)
      }).catch(function(err){
        console.log("PdfContract-------errir", err)
      })
    }).catch(function(err){
      console.log("Instance.Error", err)
    })
  }

  App.start();
});


// window.addEventListener("load", function() {
//   // if (window.ethereum) {
//   //   // use MetaMask's provider
//   //   App.web3 = new Web3(window.ethereum);
//   //   window.ethereum.enable(); // get permission to access accounts
//   // } else {
//   //   console.warn(
//   //     "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
//   //   );
//   //   // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
//   //   App.web3 = new Web3(
//   //     new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
//   //   );
//   // }
  
//     console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
//     // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
//     App.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
//     PdfContract.setProvider(App.web3.currentProvider);

//   App.start();
// });


// window.addEventListener("load", function(){
//   if (typeof web3 !== 'undefined') {
//     console.warn("Using web3 detected from external source like Metamask")
//     // Use Mist/MetaMask's provider
//     window.web3 = new Web3(web3.currentProvider);
//   } else {
//     console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
//     // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
//     window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//   }

//   Voting.setProvider(web3.currentProvider);
//   App.start();
// })
