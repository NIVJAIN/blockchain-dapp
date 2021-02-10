
  const App = {
    user_login : async function(e){
      e.preventDefault();
      try {
          // var _email = document.forms["my-form"]["email-address"].value;
          var _email = document.getElementById("inputEmail").value 
          // var _passowrd = document.forms["my-form"]["password"].value;
          var _passowrd = document.getElementById("inputPassword").value 
          if(_email==null || _email=="")
          {
              alert("Please Enter Your Email address");
              return false;
          }else if (_passowrd==null || _passowrd=="")
          {
              alert("Please Enter Your passowrd");
              return false;
          }
        
          let reqBody = JSON.stringify({
              email: _email,
              password: _passowrd
          }); 
          console.log("reqBody", reqBody)
          let urlAxios = 'http://localhost:5000/user/cookielogin'
          let methodType = 'POST'
          let token = "";
          let response = await App.axios_request(urlAxios,methodType,reqBody)
          // console.log("response",response)  
          console.log("cookietoken")
          window.localStorage.setItem("email",_email ) 
          // console.log("GetToken", token)
          window.location = "http://localhost:5000/upload"
          // if(redirectResponse) {
          //     // console.log(redirectResponse)
          //     window.location = "http://localhost:5000/upload"  + `?token=${token}`;
          // }
      } catch (error) {
          console.log(error)
        $('#bodyMsg').html(error);
        $('#myModal').modal("show");  
      }
    },
    user_login_jwt : async function(e){
        e.preventDefault();
        try {
            // var _email = document.forms["my-form"]["email-address"].value;
            var _email = document.getElementById("inputEmail").value 
            // var _passowrd = document.forms["my-form"]["password"].value;
            var _passowrd = document.getElementById("inputPassword").value 
            if(_email==null || _email=="")
            {
                alert("Please Enter Your Email address");
                return false;
            }else if (_passowrd==null || _passowrd=="")
            {
                alert("Please Enter Your passowrd");
                return false;
            }
          
            let reqBody = JSON.stringify({
                email: _email,
                password: _passowrd
            }); 
            console.log("reqBody", reqBody)
            let urlAxios = 'http://localhost:5000/user/login'
            let methodType = 'POST'
            let token = "";
            let response = await App.axios_request(urlAxios,methodType,reqBody)
            console.log("response",response)  
            window.localStorage.setItem("token", response.token) 
            window.localStorage.setItem("refreshToken", response.refreshToken)  
            let redirectUrl = 'http://localhost:5000/upload'
            token = window.localStorage.getItem("token")
            console.log("GetToken", token)
            // let redirectResponse = await App.axios_request_token(redirectUrl,"GET",token)
            // let redirectResponse = await App.axios_req(token)
            window.location = "http://localhost:5000/upload"  + `?token=${token}`;
            // if(redirectResponse) {
            //     // console.log(redirectResponse)
            //     window.location = "http://localhost:5000/upload"  + `?token=${token}`;
            // }
        } catch (error) {
            console.log(error)
          $('#bodyMsg').html(error);
          $('#myModal').modal("show");  
        }
      },

      axios_request : async function(urlAxios, requestType,reqBody) {
          return new Promise (async(resolve,reject)=>{
            try {
                let res = await axios({
                    // method: 'POST',
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
                return reject(error)
                return reject(error.response.data)
            }
          })
        },   
        axios_request_token : async function(urlAxios, requestType,token) {
          return new Promise (async(resolve,reject)=>{
            console.log('axios-request-token', token)
        
            try {
                let res = await axios({
                    // method: 'POST',
                    method: 'GET',
                    headers: { 'content-type': 'application/json',"authorization" : `Bearer ${token}`},
                    url : 'http://localhost:5000/upload',
                    // data: reqBody
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
                return reject(error)
                return reject(error.response.data)
            }
          })
        },  
        axios_req :async function(token){
          return new Promise(async(resolve,reject)=>{
            const options = {
              method: 'GET',
              url: 'http://localhost:5000/upload',
              headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${token}` 
              }
            };
            
           await axios.request(options).then(function (response) {
              // console.log(response.data);
              resolve(response.data)
            }).catch(function (error) {
              console.error(error);
              reject(error)
            });
          })
        }
    }

window.App = App;


window.addEventListener("load", function() {
//   App.start();
});