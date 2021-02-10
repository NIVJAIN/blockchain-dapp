// "use strict";
/* ====================================================
                    IMPORT SETUP
==================================================== */ 
require('dotenv').config()
const express = require('express')
const fs = require('fs')
const app = express();
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')
mongoose.Promise = global.Promise;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
var server = require('http').createServer(app);
const moment = require('moment')
const cookieParser = require('cookie-parser')
const checkAuth = require('./api/middleware/check-auth')
console.log("Moment", moment().format("DD-MM-YYYY-HHmmss"), moment().unix(), Date.now().toString())
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const Provider = require('./middlewares/blockchain/provider')
const provider = new Provider()
const web3 = provider.web3
/* ====================================================
                    MULTER SETUP
======================================================*/ 
const multer = require('multer');
// const upload = multer();

const helpers = require('./middlewares/helper');
const f_path = "uploaded"
fs.mkdirSync(f_path, { recursive: true })
const storage = multer.diskStorage({
   
    destination: function(req, file, cb) {
        cb(null, 'uploaded/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        filenameWithOutExtension=  path.parse(file.originalname).name;
        cb(null, filenameWithOutExtension + '-' + Date.now() + path.extname(file.originalname));
    }
});
app.use(cookieParser())

// var fse = require('fs-extra');
// var filelocation = './api/middlewares/blockchain'
// fse.copySync(path.resolve(__dirname ,'./api/middlewares/blockchain/metadata.js'), `${filelocation}/${moment().format("DD-MMM-YYYY-HHmmss")}-metada.js`);

/* ====================================================
                    CORS SETUP
======================================================*/ 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
});
/* ====================================================
                    ROUTES SETUP
======================================================*/ 
// const newsRouter = require('./api/routes/notinuseRouter')
const pdfchecker = require('./api/models/blockchain_model')
const blockchain = require('./api/routes/blockchain_routes.js')
const kafka = require('./api/routes/kafka_routes.js')
const user = require("./api/routes/user_routes")

app.use('/blockchain', blockchain.router)
app.use('/kafka', kafka.router)
app.use('/user', user.router)
app.post('/upload-profile-pic', (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    // let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('pdf_file');
    let upload = multer({ storage: storage }).single('profile_pic');

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        console.log("req.file==>>", req.file)
        if (req.fileValidationError) {
            // return res.send(req.fileValidationError);
            return res.status(500).json({
                err: "file Validation error"
            })
        }
        else if (!req.file) {
            // return res.send('Please select an image to upload');
            return res.status(500).json({
                err: "Please select an image to upload"
            })
        }
        else if (err instanceof multer.MulterError) {
            // return res.send(err);
            return res.status(500).json({
                err: err
            })
            
        }
        else if (err) {
            // return res.send(err);
            return res.status(500).json({
                err: err
            })
        }
        // Display uploaded image for user validation
        console.log(req.file)
        // res.send(req.file.filename)
        res.status(200).json({
            result: req.file.filename
        })
    
    
        // res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
    });
});
/* ====================================================
                    STATIC SITE SETUP
======================================================*/ 
app.use(express.static(__dirname + "/api/views"));
app.use(express.static(__dirname + "/View"));
app.use(express.static(__dirname + "/uploaded"));
app.use(express.static(__dirname + '/public'))


app.get('/', (req,res,next)=>{
    res.status(200).json({
        message: "SuccesspulumiJabil"
    })
})

app.get('/healthy', (req,res,next)=>{
    res.status(200).json({
        message: "Iam 200% ok"
    })
})

app.get('/upload3',checkAuth.QUERY_AUTH, (req,res,next)=>{
    // return res.sendFile(__dirname + '/Pview/dashboard.html');
    return res.sendFile(path.join(__dirname , "/Pview/upload.html"))
})

app.get('/upload',checkAuth.COOKIE_AUTH, (req,res,next)=>{
    // return res.sendFile(__dirname + '/Pview/dashboard.html');
    return res.sendFile(path.join(__dirname , "/Pview/upload.html"))
})

// const cron = require('./services/jobSchedular')
server.listen(PORT, function(){
    console.log(`magik happens on this port => https://localhost:${PORT}`)
});