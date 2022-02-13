// import {Router} from 'express';
var express = require('express');
let router = express.Router()
const blockchain_controller = require('../controllers/blockchain_controller');
const checkAuth = require('../middleware/check-auth')
var multer  = require('multer')
var upload = multer()



router.get("/check", blockchain_controller.CHECK)
router.get("/email/:email", blockchain_controller.CHECK_EMAIL)
// router.get("/:email", blockchain_controller.GET_INFO)
router.post("/register", blockchain_controller.REGISTER)
// router.post("/pdf", checkAuth.COOKIE_AUTH,blockchain_controller.PDF_TXN)
router.post("/pdf", blockchain_controller.PDF_TXN)

router.post("/foohash", blockchain_controller.FOO_HASH_TXN)
router.get("/foohash", blockchain_controller.GET_FOO_HASH)
router.get("/pdflist", blockchain_controller.GET_PDF_LIST)

router.post("/pdfdetails", blockchain_controller.BLOCKCHAIN_GET_PDF_DETAILS)

router.post('/filehash', blockchain_controller.GET_PDF_FILE_HASH)
router.post('/buffer',upload.single('profile_pic'), blockchain_controller.BLOCKCHAIN_CHECK_PDF_HASH)


module.exports = {router};
