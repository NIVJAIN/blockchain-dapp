  var arrayData = [
    {
      blockHash: "0x917c7679f867844d15569c3122e811cfb3f8bdd290fd30c42cce74158b07116a",
      blockNumber: 7,
      contractAddress: null,
      cumulativeGasUsed: 264227,
      from: "0xb4818b96211ef7a4ba9a33ead22237d1e2fc4a59",
      gasUsed: 264227,
      status: true,
      to: "0x03c1d778712c1e503be47b426c9d47374b0e401e",
      transactionHash: "0xe7c7edbbcff691f4857aeae2476323221cd8c19fb5decfc8da473eca93d3191a",
      transactionIndex: 0
  },
  {
    blockHash: "SDFAS",
    blockNumber: 7,
    contractAddress: null,
    cumulativeGasUsed: 264227,
    from: "ASDF",
    gasUsed: 264227,
    status: true,
    to: "ASDF",
    transactionHash: "ASDF",
    transactionIndex: 0
},
]
  const App = {
    BlockchainRegistration : async function(e){
        e.preventDefault();
        try {
            var _companyname = document.forms["my-form"]["company-name"].value;
            var _companyemail = document.forms["my-form"]["email-address"].value;
            var _pdf_file = document.forms["my-form"]["profile_pic"].value;
            var pdfFile = document.querySelector('#profile_pic');
            let profile_file = pdfFile.files[0]
            var just_filename = _pdf_file.split(/(\\|\/)/g).pop()
            // var pdf_file = document.querySelector('#profile_pic'); doesnt work
            // var emailid = document.forms["my-form"]["email-address"].value;
            
            if(_companyname==null || _companyname=="")
            {
                alert("Please Enter Your Company Name");
                return false;
            }else if (_companyemail==null || _companyemail=="")
            {
                alert("Please Enter Your Email Address");
                return false;
            }
            else if (_pdf_file==null || _pdf_file=="")
            {
                alert("Please select PDF file only");
                return false;
            }
            console.log(_pdf_file)
            let f_upload = await App.file_upload("http://localhost:9000/upload-profile-pic", "POST", profile_file)
            console.log(f_upload)
            let reqBody = JSON.stringify({
                email: 'niv.jain@gmail.com',
                companyname: _companyname,
                companyemail: _companyemail,
                pdf_filename: f_upload
            }); 
            let urlAxios = 'http://localhost:9000/blockchain/pdf'
            let methodType = 'POST'
            let response = await App.axios_request(urlAxios,methodType,reqBody)
            console.log("response",response)  
            let updateTable = await App.update_table(response.data)
            // $('#bodyMsg').html("Are you sure you want to give away all of your tokens");
            // $('#myModal').modal("show");         
        } catch (error) {
          var data = {
            blockHash: "0x917c7679f867844d15569c3122e811cfb3f8bdd290fd30c42cce74158b07116a",
            blockNumber: 7,
            contractAddress: null,
            cumulativeGasUsed: 264227,
            from: "0xb4818b96211ef7a4ba9a33ead22237d1e2fc4a59",
            gasUsed: 264227,
            status: true,
            to: "0x03c1d778712c1e503be47b426c9d47374b0e401e",
            transactionHash: "0xe7c7edbbcff691f4857aeae2476323221cd8c19fb5decfc8da473eca93d3191a",
            transactionIndex: 0
          }
          let updating_table = await App.update_table(error.error.info)
          // let updating = await App.update_array_table(arrayData)
          $('#bodyMsg').html(error.error.err0r);
          $('#myModal').modal("show");  
        }
      },

      update_table : async function(data){
        return new Promise((resolve,reject)=>{
          $(".tabBody tbody ").html("");        // Or
          $(".tabBody tbody").html("&nbsp;");  // Add a non-breaking space. (Recommended)
          $(".tabBody tbody").empty(); // this is to clean table for dom.
          var arrayData = [];
          arrayData.push(data)
          i =0;
            for (const [key, value] of Object.entries(data)) {
              i++
              console.log(`${key}: ${value}`);
               var state  = '<tr><td text-align=left">' 
                  +  (i) + ". " 
                  + '</td><td text-align=left">' 
                  + key
                  + '</td><td text-align=left"> ' 
                  + `${value}`
                  + '</td></tr>';
                  $('.tabBody').find('tbody').append(state);
            }
          resolve(true)
        })
      },
      update_array_table : async function(data){
        return new Promise((resolve,reject)=>{
          $(".tabBody tbody ").html("");        // Or
          $(".tabBody tbody").html("&nbsp;");  // Add a non-breaking space. (Recommended)
          $(".tabBody tbody").empty(); // this is to clean table for dom.

          for(let i =0; i< data.length; i++){
            for (const [key, value] of Object.entries(data[i])) {
              
              console.log(`${key}: ${value}`);
               var state  = '<tr><td text-align=left">' 
                  +  (i) + ". " 
                  + '</td><td text-align=left">' 
                  + key
                  + '</td><td text-align=left"> ' 
                  + `${value}`
                  + '</td></tr>';
                  $('.tabBody').find('tbody').append(state);
            }
          }
      

          resolve(true)
        })
      },
      axios_request : async function(urlAxios, requestType,reqBody,) {
          return new Promise (async(resolve,reject)=>{
            try {
                let res = await axios({
                    method: 'POST',
                    method: requestType,
                    headers: { 'content-type': 'application/json'},
                    url : urlAxios,
                    data: reqBody
                });
                // console.log(res)
                let data = res.data;
                // console.log(data, res);
               return resolve(data)
            } catch (error) {
              // console.log("eeeee",JSON.stringify(error))
                // console.log(error.response.data); //index.js:82 {error: "This user niv.jain@gmail.com already exists in the chain"}
                // console.log(error.response.data.error); // this is the main part. Use the response property from the error object
                // return error.response;
                return reject(error.response.data)
            }
          })
        },
        file_upload : async function(urlAxios, requestType, pdf_file) {
            return new Promise(async(resolve,reject)=>{
                let formData = new FormData();
                formData.append("profile_pic", pdf_file);
                await  axios.post('/upload-profile-pic',
                    formData, {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                    }
                  ).then(async function (result) {
                    // console.log('SUCCESS!!', result.data.filename);
                    resolve(result.data.filename)
                  })
                  .catch(async function (error) {
                    console.log('FAILURE!!', error);
                    reject("FAILURE!!!")
                  });
            })
        },
        inputBoxFocus : function(){
          $(".tabBody tbody ").html("");        // Or
          $(".tabBody tbody").html("&nbsp;");  // Add a non-breaking space. (Recommended)
          $(".tabBody tbody").empty(); // this is to clean table for dom.
        },
    }

window.App = App;

// async function BlockchainRegistration2(){
//     try {
//         let reqBody = JSON.stringify({
//             email: 'niv.jain@gmail.com',
//             companyname: 'JarvisApple',
//             companyemail: 'applewatch@gmail.com',
//             pdf_filename: 'apple.pdf'
//         });
//         let urlAxios = 'http://localhost:9000/blockchain/pdf'
//         let methodType = 'POST'
//         let response = await App.axios_request(urlAxios,methodType,reqBody)
//         console.log(response)
//     } catch (error) {
//       console.error("Failure reason", error);
//     }
//   }

window.addEventListener("load", function() {
//   App.start();
});




// import Web3 from "web3";
// import { default as contract } from 'truffle-contract'
// import axios from "axios";
// // import metaCoinArtifact from "../../build/contracts/MetaCoin.json";
// import metaCoinArtifact from "../../build/contracts/SmartContract.json";
// var PdfContract = contract(metaCoinArtifact);

// const App = {
//   web3: null,
//   contractInstance: null,
//   account: null,
//   meta: null,
//   start: async function() {
//     const { web3 } = this;
//     try {
//     //  PdfContract.setProvider(new Web3.providers.HttpProvider('http://localhost:7545'));
//       // get contract instance
//       PdfContract.setProvider(web3.currentProvider);
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = metaCoinArtifact.networks[networkId];
//       this.meta = new web3.eth.Contract(
//         metaCoinArtifact.abi,
//         deployedNetwork.address,
//       );

//       // get accounts
//       const accounts = await web3.eth.getAccounts();
//       this.account = accounts[0];
//     } catch (error) {
//       console.error("Could not connect to contract or chain.");
//     }
//   },
//   register: async function(){
//     // {username, emailid} = await validform();
//     var username = document.forms["my-form"]["full-name"].value;
//     var emailid = document.forms["my-form"]["email-address"].value;
//     console.log("heheheheheheheeheheheheheheh", this.account)
//     const { register } = this.meta.methods;
//     console.log("resiger", register, username, emailid)
//     const reg = await register(web3.utils.asciiToHex("sripal.jain@gmail.com"),web3.utils.asciiToHex("sripal")).send({gas: 140000, from: this.account})
    
//     // await PdfContract.deployed().then(function(instance){
//     //   console.log("instansssce", instance)
//     // }).catch(function(err){
//     //   console.log(err)
//     // })
//     console.log(reg)
//     // console.log("sfasdf", await this.getInfo())
//   }, 
//   getInfo2: async function(){
//     try {
//       // await contract.methodCall();
//       const { getInfo } = this.meta.methods;
//       var email = this.web3.utils.asciiToHex("sripal.jain@gmail.com")
//       // var info = await getInfo(this.web3.utils.asciiToHex("sripal.jain@gmail.com")).call();
//       var info = await getInfo(email).call();
//       var uname = await this.web3.utils.hexToAscii(info[0])
//       var emailid = await this.web3.utils.hexToAscii(info[1])
//       console.log("Info==================",uname, emailid)
//       // alert(uname)

//     } catch (error) {
//       // error.reason now populated with an REVERT reason
//       console.error("Failure reason", error);
//     }
//   },
//   BlockchainRegistration: async function(){
//     try {
//         const options = {
//             method: 'POST',
//             url: 'http://localhost:9000/blockchain/pdf',
//             // headers: {'user-agent': 'vscode-restclient', 'content-type': 'application/json'},
//             headers: { 'content-type': 'application/json'},
//             data: {
//               email: 'niv.jain@gmail.com',
//               companyname: 'JarvisApple',
//               companyemail: 'applewatch@gmail.com',
//               pdf_filename: 'apple.pdf'
//             }
//           };
//        response = await axios.request(options)
//        console.log(response.data)
//     } catch (error) {
//       console.error("Failure reason", error);
//     }
//   },
// } //App

// window.App = App;

// window.addEventListener("load", function() {
//   if (window.ethereum) {
//     // use MetaMask's provider
//     App.web3 = new Web3(window.ethereum);
//     window.ethereum.enable(); // get permission to access accounts
//   } else {
//     console.warn(
//       "No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live",
//     );
//     // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
//     App.web3 = new Web3(
//       new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
//     );
//     // PdfContract.setProvider(new Web3.providers.HttpProvider('http://localhost:7545'));
//   }
//   // PdfContract.setProvider(App.web3.currentProvider);
//   // var email = App.web3.utils.asciiToHex("sripal.jain@gmail.com")
//   // PdfContract.deployed().then(function(instance){
//   //   console.log("instance", instance)
//   //   instance.getInfo(email).then(function(result){
//   //     var uname =  App.web3.utils.hexToAscii(result[0])
//   //     console.log("sfasfasfsfsfsfsafsdf===", uname)
//   //   }).catch(function(err){
//   //     console.log("PdfContract-------errir", err)
//   //   })
//   // }).catch(function(err){
//   //   console.log("Instance.Error", err)
//   // })
//   App.start();
// });

// // axios.request(options).then(function (response) {
// //     console.log(response.data);
// // }).catch(function (error) {
// //     console.error(error);
// // });





























// // $( document ).ready(function() {
// //   if (typeof web3 !== 'undefined') {
// //     console.warn("Using web3 detected from external source like Metamask")
// //     // Use Mist/MetaMask's provider
// //     window.web3 = new Web3(web3.currentProvider);
// //   } else {
// //     console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
// //     // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
// //     window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
// //   }

// //   PdfContract.setProvider(web3.currentProvider);
// //   var email = web3.utils.asciiToHex("sripal.jain@gmail.com")
// //   PdfContract.deployed().then(function(instance){
// //     console.log("instance", instance)
// //     instance.getInfo(email).then(function(result){
// //       var uname =  web3.utils.hexToAscii(result[0])
// //       console.log("sfasfasfsfsfsfsafsdf===", uname)
// //     }).catch(function(err){
// //       console.log("PdfContract-------errir", err)
// //     })
// //   }).catch(function(err){
// //     console.log("Instance.Error", err)
// //   })

// // });