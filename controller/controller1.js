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
    res.render('login', {pageTitle:'get login', path:'/login'})
}

exports.postLogin = (req, res, next) =>{
    res.render('login', {pageTitle:'post login', path:'/login'})
}

exports.getSignup = (req, res, next) =>{
    res.render('signup', {pageTitle:'get sign up', path:'/signup'})
}

exports.postSignup = (req, res, next) =>{
    res.render('signup', {pageTitle:'post sign up', path:'/signup'})
}