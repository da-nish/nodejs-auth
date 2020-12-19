const express = require('express')
const userContoller = require('../controller/controller1')
const route = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/user')
const validate = require('../middleware/validator')
const isAuth = require('../middleware/is-auth')



route.get('/', userContoller.home)
route.get('/about', isAuth ,userContoller.about)
route.get('/profile', isAuth ,userContoller.profile) //using isAuth to required login

route.get('/login', userContoller.getLogin)
route.post('/login', [validate.validateEmailExist ,validate.validatePassword],userContoller.postLogin)
route.get('/logout', userContoller.logout)

route.post('/reset', [ validate.validateEmailExist ], userContoller.postReset)//from reset form
route.get('/reset/:token/:email', userContoller.getReset)//from link 
route.post('/reset_password', [validate.validatePassword, validate.validatePasswordEqual], userContoller.postPassReset)//from new password form

route.get('/signup', userContoller.getSignup)
route.post('/signup', [validate.validateName, validate.validateEmailNotExist, validate.validatePassword], userContoller.postSignup)

module.exports = route
