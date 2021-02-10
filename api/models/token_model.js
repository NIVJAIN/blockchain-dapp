const mongoose = require('mongoose');
const tokenSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true, index: { unique: true } },
  token: {type:String, required:true, unique: true},
  createdat: {type:Date, default: Date.now ,required:false},
},{ collection: 'tokens' });
module.exports = mongoose.model('Refreshtokens', tokenSchema)