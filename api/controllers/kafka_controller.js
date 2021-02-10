const mongoose = require("mongoose");
const kafka_model = require('../models/kafka_model')


const SIMPLE_PRODUCER_KAFKA =  (async (req,res,next)=>{
    var payload = {
        "requestData":"randome data my-data","articles":"jain"
    }
    try {
      producerResult = await kafka_model.SIMPLE_PRODUCER_KAFKA(payload);
      res.status(200).json({message:producerResult})
    } catch (err) {
      console.log("Error", err)
      res.status(500).json({error:err})
    }

})


module.exports = {
    SIMPLE_PRODUCER_KAFKA,
}