// import {Router} from 'express';
var express = require('express');
let router = express.Router()
const kafka_controller = require('../controllers/kafka_controller');

router.get("/check", kafka_controller.SIMPLE_PRODUCER_KAFKA)
// router.get("/:email", blockchain_controller.CHECK_EMAIL)
// // router.get("/:email", blockchain_controller.GET_INFO)
// router.post("/register", blockchain_controller.REGISTER)
module.exports = {router};
