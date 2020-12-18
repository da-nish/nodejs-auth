
const User = require('../models/user')
const bcrypt = require('bcryptjs')

//HOME
exports.home = (req, res, next) =>{
    res.render('home', {pageTitle:'Home', isAuth:req.session.isAuth, user: req.session.c_user , path:'/'})
}

// ABOUT
exports.about = (req, res, next) =>{
    res.render('about', {pageTitle:'About', isAuth:req.session.isAuth, user: req.session.c_user ,path:'/about'})
}

// PROFILE
exports.profile = (req, res, next) =>{
    res.render('profile', {pageTitle:'Profile', isAuth:req.session.isAuth, user: req.session.c_user ,path:'/profile'})    
}

// LOGIN
exports.getLogin = (req, res, next) =>{
    res.render('login', {
        pageTitle:'get login', 
        isAuth:req.session.isAuth, 
        user: req.session.c_user, 
        formErr:req.flash('error'), 
        formSucc:req.flash('success'), 
        csrfToken: req.csrfToken(), 
        path:'/login'
    })
}

// LOGIN OnSubmit
exports.postLogin = (req, res, next) =>{
    const email = req.body.email;
    const pass = req.body.password;
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
                    console.log('logged in')
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
    req.session.destroy(
        () =>  res.redirect('/')
    )
}

// SIGNUP 
exports.getSignup = (req, res, next) =>{
    res.render('signup', {
        pageTitle:'get sign up', 
        isAuth:req.session.isAuth, 
        user: req.session.c_user,
        formErr:req.flash('error'), 
        formSucc:req.flash('success'), 
        csrfToken: req.csrfToken(),
        path:'/signup'
    })
}

// SIGNUP OnSubmit
exports.postSignup = (req, res, next) =>{
    
    const name1 = req.body.name;
    const email1 = req.body.email;
    const pass1 = req.body.password;
    User.findOne({email:email1})
        .then( re => {//if user exist
            if(re){ 
                console.log('user exist')
                req.flash('error', 'This User Already Exist.')
                return res.redirect('/signup')
            }

            return bcrypt.hash(pass1,12)//value return to next then block
                .then( hashPass => {
                    const user = User({
                        name: name1,
                        email: email1,
                        password: hashPass
                    });
                    return user.save()
                })
                .then( user => {
                    console.log('user added')
                    // console.log(user)
                    req.flash('success', 'User Created Successfully.')
                    res.redirect('/login')
                })
        })
        .catch(err => console.log(err))
}