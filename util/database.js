/**
 * MongoDB
 */

const mongodb = require('mongodb')
const mongo_client = mongodb.MongoClient;
const db_url = 'mongodb+srv://root1:rootroot@cluster0.sdkrx.mongodb.net/userlogin' //db name userlogin

let _db; // can be used inside this file

const mongo_connect = (callback) => {
    mongo_client
    .connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true})//handling error with using extra args
    .then(result => {
        console.log('db connected')
        _db = result.db();//saving connection
        callback()
    })
    .catch(err => console.log(err))
}

const getDB = () =>{
    if(_db){
        return _db
    }
    throw 'No database found'
}

exports.mongo_connect = mongo_connect
exports.getDB = getDB