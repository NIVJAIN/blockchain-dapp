var kafka = require('kafka-node');
let PROCESS = require('./call_news_api')
const winston = require('./config/logfive')
exports.initiateKafkaConsumerGroup = async function (groupName, topicName) {
    var options = {
      // connect directly to kafka broker (instantiates a KafkaClient)
      kafkaHost: '127.0.0.1:9092',
      groupId: groupName,
      autoCommit: true,
      autoCommitIntervalMs: 5000,
      sessionTimeout: 15000,
      fetchMaxBytes: 10 * 1024 * 1024, // 10 MB
      // An array of partition assignment protocols ordered by preference. 'roundrobin' or 'range' string for
      // built ins (see below to pass in custom assignment protocol)
      protocol: ['roundrobin'],
      // Offsets to use for new groups other options could be 'earliest' or 'none'
      // (none will emit an error if no offsets were saved) equivalent to Java client's auto.offset.reset
      fromOffset: 'latest',
      // how to recover from OutOfRangeOffset error (where save offset is past server retention)
      // accepts same value as fromOffset
      outOfRangeOffset: 'earliest'
    };
  
    var consumerGroup = new kafka.ConsumerGroup(options, topicName);
  
    consumerGroup.on('message', async function (message) {
      // console.log('Message: ' + JSON.stringify(message), message.partition);
      winston.fatal("Message::>>", message.value)
      console.log('Message: ' + JSON.stringify(message.value), message.partition, message.value);
      //TODO: You can write your code or call messageProcesser function
      let mongoId = JSON.parse(message.value);
      winston.fatal("Parse::", mongoId, "ddd",typeof mongoId)
      // mongoId = mongoId.trimLeft();
      // mongoId = mongoId.trimRight();
      let processResults = await PROCESS.CALL_NEWS_API(mongoId.id);
      winston.info("ProcessResults", processResults)
    });
  
    consumerGroup.on('error', function onError(error) {
      console.error(error);
    });
  
    // console.log('Started Consumer for topic "' + topicName + '" in group "' + groupName + '"');
  };