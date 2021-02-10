const kafkaProducer = require('../../middlewares/kafka/HighLevelProducer');
const kafkaConsumer = require('../../middlewares/kafka/HighLevelConsumer');
// kafkaConsumer.initiateKafkaConsumerGroup('testGroup', 'nivjain');
const SIMPLE_PRODUCER_KAFKA = async (_payload) =>{
    return new Promise(async (resolve, reject) => {
       await kafkaProducer.produceJob('nivjain', _payload, false,async function(err, data){
            // console.log("data",data)
            if(err){
                console.log("err", err)
                return reject(err)
            }
            resolve("KafkaMessageSentSuccesfully")
        })
    }) 
}

module.exports = {
    SIMPLE_PRODUCER_KAFKA,
}