
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { body, validationResult } = require('express-validator');

//HOME
exports.home = (req, res, next) =>{
    console.log('HOME PAGE')
    res.render('home', {pageTitle:'Home', isAuth:req.session.isAuth, user: req.session.c_user , path:'/'})
}

// ABOUT
exports.about = (req, res, next) =>{
    console.log('ABOUT PAGE')
    res.render('about', {pageTitle:'About', isAuth:req.session.isAuth, user: req.session.c_user ,path:'/about'})
}

// PROFILE
exports.profile = (req, res, next) =>{
    console.log('PROFILE PAGE')

    res.render('profile', {pageTitle:'Profile', isAuth:req.session.isAuth, user: req.session.c_user ,path:'/profile'})    
}

// LOGIN
exports.getLogin = (req, res, next) =>{
    console.log('LOGIN PAGE')

    res.render('login', {
        pageTitle:'get login', 
        isAuth:req.session.isAuth, 
        user: req.session.c_user, 
        formErr:req.flash('error'), 
        formSucc:req.flash('success'), 
        reset_succ:req.flash('reset_succ'), 
        reset_err:req.flash('reset_err'), 
        csrfToken: req.csrfToken(), 
        path:'/login',
        oldInput: {
            email: ''
        }
    })
}

// LOGIN OnSubmit
exports.postLogin = (req, res, next) =>{
    const email = req.body.email;
    const pass = req.body.password;

    const error = validationResult(req)
    
    if(!error.isEmpty()){
        console.log(error.array())
        req.flash('error', error.array()[0].msg)
        return res.status(422).redirect('/login')//422 for invalid input
        //do render to pass old values and make change in get Method
    }

    User.findOne({email:email})
        .then( user => {
            if(!user){ 
                console.log('Invalid user')
                req.flash('error', 'Invalid Email or Password.')
                return res.redirect('/login') 
            }
            bcrypt.compare(pass, user.password)//return boolean
            .then( passMatch =>  {//passMatch is boolean
                if(passMatch){                
                    console.log('LOGGIN IN')
                    //start session
                    req.session.isAuth = true;
                    req.session.c_user = user
                    return req.session.save(
                        () =>{
                            // console.log('sesion saved')
                            res.redirect('/')
                        })
                }
                else{
                    //if passMatch is false
                    req.flash('error', 'Invalid Email or Password.')
                    res.redirect('/login')
                }

            }).catch(err => {
                console.log('error: '+err)
                res.redirect('/login')
            })
            
        })
        .catch(err => console.log(err))
}

// LOGOUT
exports.logout = (req, res, next) =>{
    console.log('LOGOUT')
    req.session.destroy(
        () =>  res.redirect('/')
    )
}

// ForgetPassword OnSubmit 
exports.postReset = (req, res, next) =>{
    const email = req.body.email;
    const error = validationResult(req)
    
    if(!error.isEmpty()){
        console.log(error.array())
        req.flash('reset_err', error.array()[0].msg)
        return res.status(422).redirect('/login')//422 for invalid input
        //do render to pass old values and make change in get Method
    }

    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            console.log(err)
            return res.redirect('/login')
        }
        
        const TOKEN = buffer.toString('hex')
        
        User.findOne({email:email})
            .then( user => {

                //SENT EMAIL TO USER
                // reset link example: domain/reset/<TOKEN>/<EMAIL>
                user.reset_pass_token = TOKEN
                user.reset_token_expiry = Date.now() + 3600
                return user.save()
                        .then(result => {
                            console.log('MAIL SENT')
                            console.log('reset/'+TOKEN+'/'+email)
                            req.flash('reset_succ', ' reset link sent to '+email)
                            return res.redirect('/login') 
                        })
                        .catch( err => console.log(err))
            }) //User end
    })//crypto end
}


// Reset (from mail link)
exports.getReset = (req, res, next) =>{
    const token = req.params.token
    const email = req.params.email

    User.findOne({email: email, reset_pass_token: token})
        .then(user => {
            if (!user){
                req.flash('reset_err', 'Invalid Token, Please generate new and try again.')
                return res.redirect('/login')
            }
            else{
                console.log('NEW PASSWORD')
                return res.render('password_reset', {
                    pageTitle:'Password Reset', 
                    token: token,
                    useremail: email,
                    formErr:req.flash('error'), 
                    formSucc:req.flash('success'), 
                    csrfToken: req.csrfToken(),
                })
            }
        })
        .catch(err => console.log(err))
}

// Password Reset OnSubmit
exports.postPassReset = (req, res, next) => {
    const email = req.body.email
    const token = req.body.token
    const password = req.body.password
    const password_con = req.body.password_con
    let ResetUser;
    const error = validationResult(req)
    
    if(!error.isEmpty()){
        console.log(error.array())
        req.flash('error', error.array()[0].msg)
        return res.status(422).redirect('/reset/'+token+'/'+email)//422 for invalid input
        //do render to pass old values and make change in get Method
    }

    User.findOne({email:email, reset_pass_token:token})
        .then( user => {
            if(!user){
                req.flash('reset_err', 'Token Expired !! try again.')
                return res.redirect('/login')
            }
            ResetUser = user //storing user to use in next then block
            return bcrypt.hash(password, 12)
        })
        .then( hashPass => {
            ResetUser.password = hashPass
            ResetUser.reset_pass_token = undefined
            ResetUser.reset_token_expiry = undefined
            return ResetUser.save()
        })
        .then( result => {
            console.log('Password changed successfully !!')
            req.flash('success', 'Password successfully changed !!')
            return res.redirect('/login')
        })   
        .catch(err => console.log(err))

}


// SIGNUP 
exports.getSignup = (req, res, next) =>{
    console.log('SIGN UP PAGE')
    res.render('signup', {
        pageTitle:'get sign up', 
        isAuth:req.session.isAuth, 
        user: req.session.c_user,
        formErr:req.flash('error'), 
        formSucc:req.flash('success'), 
        csrfToken: req.csrfToken(),
        path:'/signup',
        oldInput: {
            name: '',
            email: '',
            password: ''
        } 
    })
}

// SIGNUP OnSubmit
exports.postSignup = (req, res, next) =>{
    
    const name1 = req.body.name;
    const email1 = req.body.email;
    const pass1 = req.body.password;
    const error = validationResult(req)
    
    if(!error.isEmpty()){
        console.log(error.array())
        req.flash('error', error.array()[0].msg)
        return res.render('signup', 
            {
                pageTitle:'Sign Up', 
                isAuth:req.session.isAuth, 
                user: req.session.c_user,
                formErr:req.flash('error'), 
                formSucc:req.flash('success'), 
                csrfToken: req.csrfToken(),
                path:'/signup',
                oldInput: {
                    name: name1,
                    email: email1,
                    password: ''
                } 
            })
    }

    bcrypt.hash(pass1,12)//value return to next then block
        .then( hashPass => {
            const user = User({
                name: name1,
                email: email1,
                password: hashPass
            });
            return user.save()
        })
        .then( user => {
            console.log('New User Added')
            // console.log(user)
            req.flash('success', 'User Created Successfully.')
            res.redirect('/login')
        })
        .catch(err => console.log(err))
}