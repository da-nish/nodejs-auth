const express = require('express')
const userContoller = require('../controller/controller1')
const route = express.Router();

const isAuth = require('../middleware/is-auth') 

route.get('/', userContoller.home)
route.get('/about', isAuth ,userContoller.about)
route.get('/profile', isAuth ,userContoller.profile) //using isAuth to required login

route.get('/login', userContoller.getLogin)
route.post('/login', userContoller.postLogin)
route.get('/logout', userContoller.logout)

route.get('/signup', userContoller.getSignup)
route.post('/signup', userContoller.postSignup)

module.exports = route