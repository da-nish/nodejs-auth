const express = require('express')
const userContoller = require('../controller/controller1')
const route = express.Router();


route.get('/', userContoller.home)
route.get('/about', userContoller.about)
route.get('/profile', userContoller.profile)

route.get('/login', userContoller.getLogin)
route.post('/login', userContoller.postLogin)
route.get('/logout', userContoller.logout)

route.get('/signup', userContoller.getSignup)
route.post('/signup', userContoller.postSignup)

module.exports = route