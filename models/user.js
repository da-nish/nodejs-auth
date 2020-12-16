const mongo = require('mongodb');
const get_db = require('../util/database').getDB;


class User{
    constructor(name, email, password){
        this.name = name;
        this.email = email;
        this.password = password;
    }

    save() {
        const db = get_db();
        return db
            .collection('users')
            .insertOne(this)
    }

    static doLogin(email, password){
        const db = get_db();
        return db
            .collection('users')
            .findOne({email:email, password:password})
            .then() //re=>console.log(re)
            .catch()
    }

    static find_byid(userID){
        const db = get_db();
        return db.collection('users').findOne({_id: new ObjectId(userID)});
    }
}

module.exports = User


//mongooes
// const mongooes = require('mongoose')

// const schema = mongooes.Schema;

// const userSchema = schema({
//     name:{
//         type:String,
//         required: true
//     },
//     email:{
//         type:String,
//         required: true
//     },
//     password:{
//         type:String,
//         required: true
//     },
// });

// module.exports = mongooes.model('User', userSchema);