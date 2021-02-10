"use strict";
const winston = require('../config/logfive')
const fs = require('fs');
// require('dotenv-flow').config({
//   default_node_env: 'local'
// });
var ca = [fs.readFileSync("rds-combined-ca-bundle.pem")];
class MongoDatabase {
    constructor() {
       this.mongoose = require('mongoose')
    }
    connectDB() { 
      const {
        MONGO_USERNAME,
        MONGO_PASSWORD,
        MONGO_HOSTNAME,
        MONGO_PORT,
        MONGO_DB
      } = process.env;
      winston.info("MongoDBCOnnection::>>",`mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`)
      // const db = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
      // const db = `mongodb://jain:$ilovegermany1980@db:27017/newsinfo?authSource=admin`;
      const db = process.env.MONGO_CONN
      winston.info("DB===>>>>",db)
      winston.info("DB", db)
        const options = {
          sslCA: ca,
          useNewUrlParser: true,
          reconnectTries: Number.MAX_VALUE,
          reconnectInterval: 500,
          connectTimeoutMS: 10000,
          useUnifiedTopology: true
        };
        this.mongoose.connect(db, options).then( function() {
          winston.info('MongoDB is connected');
        })
          .catch( function(err) {
          winston.error(err);
        });
       const mongoConn = this.mongoose.connection;
        return mongoConn;
    }
}
module.exports = new MongoDatabase().connectDB();





// const db =           'mongodb://jain:$ilovegermany1980@127.0.0.1:27017/newsinfo?authSource=admin'
// MongoDBCOnnection::>> mongodb://jain:$ilovegermany1980@127.0.0.1:27017/newsinfo?authSource=admin

// var connected = chalk.bold.cyan;
// var error = chalk.bold.yellow;
// var disconnected = chalk.bold.red;
// var termination = chalk.bold.magenta;

// this.mongoose.connect(db,{
//   useNewUrlParser:true,
//   useUnifiedTopology: true,
//   keepAlive: true,
// }).then(function(result){

// }).catch((err) => {
//    winston.error("errRateLimiter", err)
//  });


// db.createUser(
//     {
//       user: "jain",
//       pwd: "$ilovegermany1980",
//       roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
//     }
//   )
