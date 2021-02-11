## Blockchain-Application Decentralized Certification 
| No            | Description                      | Remarks       | 
| ------------- | -------------------------------- | :-----------: |
| 1             | Blockchain Application           | Na            |
| 2             | Sequence Diagram                 | Na            |


## Pre requisite
```
0. Install Ganache 
1. Kafka docker-compose cluster must be running
2. Mongodb local installation or Atlas or AWS DocDB. 
3. MongoDB, change the connection string in database folder.
4. Create token collection TTL, this is for auto deletion of document in mongodb for refresh tokens, follow below steps


# create index on tokens collections 
db.tokens.createIndex({"createdat":1}, {expireAfterSeconds:60})
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
4. truffle migrate 
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