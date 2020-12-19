
const { body, validationResult } = require('express-validator');
const User = require('../models/user')

exports.validateName = body('name')
    .isLength({min:3})
    .withMessage('Name is too short');

exports.validatePassword = body('password')
    .isLength({min:5})
    .withMessage('password is too short');

exports.validatePasswordEqual = body('password_con')
    .custom( (value, {req}) => {
        if(value !== req.body.password)
            throw new Error('password not matching');
    });

exports.validateEmailExist = body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid Email')
    .custom( (value, {req}) => {
        return User.findOne({email:value})
            .then( re => {//if user exist
                if(!re){ 
                    console.log('user not exist');
                    // // req.flash('error', 'This User Already Exist.')
                    // return res.redirect('/asf')
                    return Promise.reject('This email is not exist.');
                }
            })
    });

exports.validateEmailNotExist = body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid Email')
    .custom( (value, {req}) => {
        return User.findOne({email:value})
            .then( re => {//if user exist
                if(re){ 
                    console.log('user exist')
                    // // req.flash('error', 'This User Already Exist.')
                    // return res.redirect('/asf')
                    return Promise.reject('This email already exist.')
                }
            })
    });

