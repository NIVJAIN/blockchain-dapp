const mongoose = require('mongoose');
const COLLETION_NAME = 'feedback'
// const winston = require('../../config/logfive')
// const rp = require('request-promise')
require('mongoose-long')(mongoose);
var Long = mongoose.Schema.Types.Long;
const fedupSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // pin: {type:String, required:true,unique: true},
    email: {type:String, required:true},
    rating: {type:String, required:false},
    hourssaved:{type:String, required:false},
    suggestions:{type:String, required:false},
    timestamp:{type: Long, required:false},
    hrtimestamp:{type:String, required:false},
    date: {type:Date, default: Date.now ,required:false},
  
},{ collection: COLLETION_NAME })

module.exports = mongoose.model('Feedback', fedupSchema)