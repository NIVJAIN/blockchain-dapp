var kafka = require('kafka-node');

var producer = null;
var readyFlag = false;

var BaseModel = function () {
};

// Need to check what is the best way? use batch mode or stream mode.
// not suer may b need to ask some one with kafka expertise.
// may be just cteate both adn dont kare.

BaseModel.prototype.produceJob = function (topic, pload, isBatchProducer, callback) {
  module.exports.getProducer(topic, pload, isBatchProducer);
  function send() {
    producer.send([
      { topic: topic, messages: JSON.stringify(pload) }
    ], function (err, data) {
      if (err) callback(err);
      else callback();
    });
  }

  if (readyFlag) {
    send();
  } else {
    setTimeout(send, 2000);
  }
};

BaseModel.prototype.getProducer = function (topic, pload, isBatchProducer) {
  if (producer) {
    return producer;
  } else {
    module.exports.setConnectoConnection(topic, pload, isBatchProducer);

    producer.on('ready', function () {
      readyFlag = true;
    });
  }
}

BaseModel.prototype.setConnectoConnection = function (topic, pload, isBatchProducer) {
  var HighLevelProducer = kafka.HighLevelProducer;
  if(isBatchProducer) {
    var client = new kafka.KafkaClient('127.0.0.1:2181', 'producer-node',
      {}, {
        noAckBatchSize: 5000000, //5 MB
        noAckBatchAge: 5000 // 5 Sec
      });
    producer = new HighLevelProducer(client, {requireAcks: 0});
  } else {
    // var client = new kafka.KafkaClient('127.0.0.1:2181', 'producer-node');
    // var client = new kafka.KafkaClient('127.0.0.1:2181', 'producer-node');
    var client = new kafka.KafkaClient()
    producer = new HighLevelProducer(client);
  }

  producer.on('error', function (err) {
    console.log('error', err);
  });

  return producer;
};

module.exports = new BaseModel();