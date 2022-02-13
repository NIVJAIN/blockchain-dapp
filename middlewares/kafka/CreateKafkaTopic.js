var kafka = require('kafka-node');
var client = new kafka.KafkaClient();

var topicsToCreate = [{
    topic: 'nivjain',
    partitions: 5,
    replicationFactor: 1
  }
];


client.createTopics(topicsToCreate, (error, result) => {
    if(error){
        console.log(error)
    }
    if(result){
        console.log("result============================>")
        console.log(result)
    }
  // result is an array of any errors if a given topic could not be created
});
