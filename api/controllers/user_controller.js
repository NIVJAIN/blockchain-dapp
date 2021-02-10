const mongoose = require("mongoose");
// const winston = require('../../config/logfive')
const fs = require('fs')
var rp = require('request-promise')
var moment = require('moment-timezone');
var _MOMENT = require('moment')
var _CONFIG = require('../../config/config')
const bcrypt = require('bcryptjs')
const User = require('../models/user_models');
const jwt = require('jsonwebtoken')
var RefreshTokens = require('../models/token_model')
const path = require('path')

exports.ADMIN_SIGNUP = (req,res,next)=>{
    var _email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2
    var _orgid = req.body.orgid;
    let errors = []; 
    console.log("kafdsfsfsdafsdfsd")
    if (!_email || !password || !password2 || !_orgid) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
    }
    if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
    }
    if (errors.length > 0) {
       return res.status(500).json({
           error: errors
       })
    }
    User.find({email:_email})
    .exec()
    .then(user=>{
        // console.log('user', user)
        if(user.length >=1){
            return res.status(409).json({
                message: 'Mail exists'
            })
        } else {
            bcrypt.hash(password,10,function(err, hash){
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: _email,
                        password: hash,
                        orgid: _orgid
                    });
                    user.save()
                    .then((result)=>{
                        return res.status(201).json({
                            message: "User Created"
                        })
                    })
                    .catch((err)=>{
                        return res.status(500).json({
                            error: err
                        })
                    })
                } 
            })
        }
    })
    .catch(err=>{
        return res.status(500).json({
            error: err
        })
    })
}

exports.ADMIN_LOGIN = async (req,res,next)=>{
    const {email, password } = req.body;
    let errors = [];
    console.log("AMINDLOGIN", email, password)
    // if (!orgid || !email || !password) {
    if (!email || !password) {
      errors.push({ msg: 'Please enter all fields' });
    }
    if (errors.length > 0) {
        return res.status(500).json({
            error: errors
        })
    }
    User.findOne({email:email})
    .exec()
    .then(resultams=>{
        console.log("asmin", resultams)
        if(resultams === null){
            return res.status(404).json({
                message : 'Auth failed Nahi'
            })
        }
        bcrypt.compare(password,resultams.password,(err,result)=>{
            console.log(err, result)
            if(err){
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            if(result){
                var token = jwt.sign({
                    email: email,
                }, _CONFIG.JWT_SECRET,
                {
                    expiresIn: "5s"
                })
                var refresh_token = jwt.sign({
                    email: email,
                }, _CONFIG.JWT_REFRESHTOKEN_SECRET)
                var updateResults =  update_Refresh_TokenInDB(email,refresh_token);
                return res.status(200).json({
                    message: "Auth successfull",
                    token: token,
                    refreshToken: refresh_token
                })
            }
            return res.status(401).json({
                message: 'Auth lfailed'
            })
        }) 
    })
    .catch(err=>{
        return res.status(500).json({
            error: err
        })
    })
}



exports.JWT_COOKIE_LOGIN = async (req,res,next)=>{
    const {email, password } = req.body;
    let errors = [];
    console.log("JWT_COOKIE_LOGIN", email, password)
    // if (!orgid || !email || !password) {
    if (!email || !password) {
      errors.push({ msg: 'Please enter all fields' });
    }
    if (errors.length > 0) {
        return res.status(500).json({
            error: errors
        })
    }
    User.findOne({email:email})
    .exec()
    .then(resultams=>{
        console.log("asminAssdsfasdfasdfdssfsfsdfsdf---->>>>", resultams)
        if(resultams === null){
            return res.status(404).json({
                message : 'Auth failed Nahi'
            })
        }
        bcrypt.compare(password,resultams.password,(err,result)=>{
            console.log("Comparing error ran result", err, result)
            if(err){
                return res.status(401).json({
                    message: 'Auth JWT_COOKIE_LOGIN failed'
                })
            }
            if(result){
                var token = jwt.sign({
                    email: email,
                }, _CONFIG.JWT_SECRET,
                {
                    expiresIn: "5s"
                })
                var refresh_token = jwt.sign({
                    email: email,
                }, _CONFIG.JWT_REFRESHTOKEN_SECRET)
                var updateResults =  update_Refresh_TokenInDB(email,refresh_token);
                // return res.status(200).json({
                //     message: "Auth successfull",
                //     token: token,
                //     refreshToken: refresh_token
                // })
                // var maxage = 2 * 60 * 60 * 1000 //2 hours
                var maxage = 2 * 60 * 60 * 1000 // 60 seconds
                res.cookie('authcookie',token,{maxAge:maxage,httpOnly:true}) 
                res.cookie('email',email,{maxAge:maxage,httpOnly:true}) 
                // res.cookie('authcookie',token,{maxAge:90000000,httpOnly:true}) 
                // res.cookie('email',email,{maxAge:90000000,httpOnly:true}) 

                res.send()
                res.end()
                return
                // return res.cookie('authcookie',token,{httpOnly:true}) 
                
            }
            console.log("iam should not nbe called ......")
            return res.status(401).json({
                message: 'Auth lfailed'
            })
        }) 
    })
    .catch(err=>{
        return res.status(500).json({
            error: err
        })
    })
}


exports.REFRESH_TOKEN = async(req,res) =>{
    const refreshToken = req.body.refreshToken
    if (refreshToken == null) return res.sendStatus(401)
    // if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    RefreshTokens.findOne({token:refreshToken}).then(function(result){
      if(result == null){
        return res.status(403).json({
          error: "Invalid token"
        })
      } else {
        jwt.verify(refreshToken, _CONFIG.JWT_REFRESHTOKEN_SECRET, (err, user) => {
          if (err) return res.sendStatus(403)
        //   const accessToken = generateAccessToken({email:user.email,orgid:user.orgid})
          const accessToken = generateAccessToken({email:user.email})
          res.json({ accessToken: accessToken })
        })
      }
    })
}


exports.REFRESH_TOKEN_COOKIE = async function (req, res){
    let accessToken = req.cookies.authcookie
    let _email = req.cookies.email
    console.log("RESFRESH_TOKEN_COOKIE", accessToken, _email)
    if (!accessToken){
        return res.status(403).send("no accesstoken in your cookie")
    }

    // let payload
    // try{
    //     payload = jwt.verify(accessToken, _CONFIG.JWT_SECRET)
    //  }
    // catch(e){
    //     return res.status(401).send("jwt.verify")
    // }

    //retrieve the refresh token from the users array
    // let refreshToken = users[payload.username].refreshToken
      //verify the refresh token
      let verifyRefreshinDB = "";
      try{
        verifyRefreshinDB = await get_refresh_token(_email)
    }
    catch(e){
        return res.status(401).send("Please relogin")
    }


    //verify the refresh token
    try{
        jwt.verify(verifyRefreshinDB.token, _CONFIG.JWT_REFRESHTOKEN_SECRET)
    }
    catch(e){
        return res.status(401).send(e)
    }

    let newToken = jwt.sign({
        email: _email,
    }, _CONFIG.JWT_SECRET,
    {
        expiresIn: "10s"
    })
    // let newToken = jwt.sign(email:_email, _CONFIG.JWT_SECRET, 
    // {
    //     // algorithm: "HS256",
    //     // expiresIn: '190s'
    //     expiresIn: "1250s"
    // })
    var maxage = 2 * 60 * 60 * 1000 // 60 seconds
    // res.cookie("authcookie", newToken, {httpOnly: true})
    res.cookie('authcookie',newToken,{maxAge:maxage,httpOnly:true}) 

    res.send({result:"RefreshToken has been set in cookie"})
    res.end()
    return
}


exports.LOGOUT = async(req, res) => {
    // refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    // delete refreshToken in mongoDB
    console.debug(req.body.refreshToken)
    try {
        var deleteResult = await delete_Refresh_Tokens_InDB(req.body.refreshToken)
        res.sendStatus(204)
    } catch(err){
        console.error(err)
        return res.status(500).json({
            error: err
        })
    }
   
}
  
exports.DASH_BOARD = async(req, res) => {
    // refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    // delete refreshToken in mongoDB
    try {
        return res.sendFile(path.join(__dirname + '/dash.html'));
    } catch(err){
        console.error(err)
        return res.status(500).json({
            error: err
        })
    }
   
}

const update_Refresh_TokenInDB = function(_email,_refreshToken){
    return new Promise((resolve,reject)=>{
      var newToken = new RefreshTokens({
        _id: new mongoose.Types.ObjectId(),
        email: _email,
        token: _refreshToken
      })
      newToken.save().then(function(result){
          console.log(result)
        resolve(result)
      }).catch(function(err){
        reject(err)
      })
    })
  }
  
  const delete_Refresh_Tokens_InDB = function(_refreshToken){
      return new Promise((resolve,reject)=>{
    RefreshTokens.findOneAndRemove({token:_refreshToken})
    .then(function(result){
        resolve(result)
      }).catch(function(err){
        reject(err)
      })
    })
  }

  const get_refresh_token = async(_email) =>{
      return new Promise((resolve,reject)=>{
        RefreshTokens.findOne({email:_email}).then(function(result){
            if(result == null){
            return reject({
                    error: `No refresh token found for ${_email}`
                })
            } else {
                resolve(result)
            }
        })
      })
}

  function generateAccessToken(user) {
    return jwt.sign(user, _CONFIG.JWT_SECRET, { expiresIn: '10s' })
  }


