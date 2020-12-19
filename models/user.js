// mongooes
const mongooes = require('mongoose')
const schema = mongooes.Schema;

const userSchema = schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    reset_pass_token: String,
    reset_token_expiry: Date,
});
const User = mongooes.model('User', userSchema);
module.exports = User