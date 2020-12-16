// const User = require('../models/user')

exports.home = (req, res, next) =>{
    res.render('home', {pageTitle:'Home', path:'/'})
}

exports.about = (req, res, next) =>{
    res.render('about', {pageTitle:'About', path:'/about'})
}


exports.profile = (req, res, next) =>{
    res.render('profile', {pageTitle:'Profile', path:'/profile'})
}


exports.getLogin = (req, res, next) =>{
    res.render('login', {pageTitle:'get login', result :'', path:'/login'})
}

exports.postLogin = (req, res, next) =>{
    const email = req.body.email;
    const pass = req.body.password;
    const result =  User.doLogin(email, pass)
        .then( re => {
            if(re == null){ 
                console.log('Invalid user') 
            }else{
                console.log('logged in')
            }
        })
        .catch(err => console.log(err))
        
    res.render('login', {pageTitle:'post login',path:'/login'})
}

exports.getSignup = (req, res, next) =>{
    res.render('signup', {pageTitle:'get sign up', path:'/signup'})
}
const { response } = require('express')
const User = require('../models/user')
exports.postSignup = (req, res, next) =>{
    
    const name1 = req.body.name;
    const email1 = req.body.email;
    const pass1 = req.body.password;

    const user = new User(name1,email1,pass1);
    user
        .save()
        .then( () => console.log('user added'))
        .catch(err => console.log(err))


    res.render('signup', {pageTitle:'post sign up', path:'/signup'})
}