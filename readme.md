## Blockchain-Application Decentralized Certification 
| No            | Description                      | Remarks       | 
| ------------- | -------------------------------- | :-----------: |
| 1             | Blockchain Application           | Na            |
| 2             | Sequence Diagram                 | Na            |


# Application's and Port
```
nodejs : 9000
mongodb: 27017
kafka: 2181
ganache-cli: 7545
```

## Pre requisite
```
1. Install Ganache and run on port 7545
2. npm install -g ganache-cli
3. ganache-cli -p 7545
4. Kafka installation and running on port 9092 and 2181
5. git clone https://github.com/NIVJAIN/kafka-stack-docker-compose.git
6. cd kafka-stack-docker-compose
7. docker-compose -f zk-single-kafka-multiple.yml up
8. docker-compose -f zk-single-kafka-multiple.yml down
9. Kafka docker-compose cluster must be running
```
λ  kafka-stack-docker-compose git:(master) ✗ docker-compose -f zk-single-kafka-multiple.yml ps
NAME                COMMAND                  SERVICE             STATUS              PORTS
kafka1              "/etc/confluent/dock…"   kafka1              running             0.0.0.0:9092->9092/tcp
kafka2              "/etc/confluent/dock…"   kafka2              running             0.0.0.0:9093->9093/tcp
zoo1                "/etc/confluent/dock…"   zoo1                running             0.0.0.0:2181->2181/tcp
```
2. Mongodb local installation or Atlas or AWS DocDB. 
docker run -p 27017:27017 -d mongo:latest
3. MongoDB, change the connection string in database folder.
4. Create token collection TTL, this is for auto deletion of document in mongodb for refresh tokens, follow below steps
# getinto mongo console or inside the mongo container
docker exec -it <mongoid> bash
# launch mongo
mongo
show dbs
use blockchain
show collections 
check tokens collection exists, if exist then execute below command to create index on token collections
# create index on tokens collections 
db.tokens.createIndex({"createdat":1}, {expireAfterSeconds:300})
# check the index creation is successfull with the expiry time set 
db.tokens.getIndexes()
# create a document inside tokens collections
db.tokens.insert({"createdat": new Date(), "text": "1-Test Notification", "user_id": 1234, "jain_id": 1234})
# check if the document is deleted based on expiry time
db.tokens.find.pretty()
# if you want to change the expiry time
db.tokens.dropIndex({"createdat":1})
# recreate with new time 
db.tokens.createIndex({"createat":1}, {expireAfterSeconds:60})You will need to convert the time to either a string or a unix 
```

## Running application
```
1. git clone <repo>
2. truffle compile
3. truffle networks --clean 
4. truffle migrate or truffle migrate --network develop
5. cd middleware && node CreateKafkaTopic.js && node CreateKafkaTopic.js (to check topic has been created)
5. npm run start
6. https://localhost:5000
```






Commands:
  Compile:              truffle compile
  Clean  :              truffle networks --clean
  Migrate:              truffle migrate
  Test contracts:       truffle test
  Run dev server:       cd app && npm run dev
  Build for production: cd app && npm run build
  
  truffle migrate --reset --compile-all


  ###
  truffle compile
  truffle networks --clean
  truffle migrate

  node server.js
  https://localhost:5000