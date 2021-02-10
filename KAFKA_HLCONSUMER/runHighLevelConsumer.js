require('dotenv').config()
const db = require('./db/mongodb')
const consumer = require('./ConsumerHighLevel');
consumer.initiateKafkaConsumerGroup('testGroup', 'nivjain');
