
const User = require('../models/user')


exports.home = (req, res, next) =>{
    res.render('home', {pageTitle:'Home', isAuth:req.session.isAuth, user: req.session.c_user , path:'/'})
}

exports.about = (req, res, next) =>{
    console.log(req.session.views)
    res.render('about', {pageTitle:'About', isAuth:req.session.isAuth, user: req.session.c_user ,path:'/about'})
}

exports.profile = (req, res, next) =>{
    if(!req.session.isAuth) res.redirect('/')
    res.render('profile', {pageTitle:'Profile', isAuth:req.session.isAuth, user: req.session.c_user ,path:'/profile'})
}

exports.getLogin = (req, res, next) =>{
    res.render('login', {pageTitle:'get login', isAuth:req.session.isAuth, user: req.session.c_user ,path:'/login'})
}

exports.postLogin = (req, res, next) =>{
    const email = req.body.email;
    const pass = req.body.password;
    const user = User.findOne(
        {email:email, password:pass})
        .then( re => {
            if(re == null){ 
                console.log('Invalid user') 
            }else{
                console.log('logged in')
                console.log(re)
                //start session
                req.session.isAuth = true;
                req.session.c_user = re
                // res.redirect('/about')
                res.render('login', {pageTitle:'post login',isAuth:req.session.isAuth, user: req.session.c_user ,path:'/login'})
            }
        })
        .catch(err => console.log(err))
        
    
}

exports.logout = (req, res, next) =>{
    req.session.destroy()
    res.redirect('/')
}

exports.getSignup = (req, res, next) =>{
    res.render('signup', {pageTitle:'get sign up', isAuth:req.session.isAuth, user: req.session.c_user ,path:'/signup'})
}


exports.postSignup = (req, res, next) =>{
    
    const name1 = req.body.name;
    const email1 = req.body.email;
    const pass1 = req.body.password;

    //Or new User();
    const user = User({
        name: name1,
        email: email1,
        password: pass1
    });
    
    user.save()
        .then( () => console.log('user added'))
        .catch(err => console.log(err))


    res.render('signup', {pageTitle:'post sign up', isAuth:req.session.isAuth, user: req.session.c_user , path:'/signup'})
}