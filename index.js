const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongooes = require('mongoose')
const app = express();
const session = require('express-session')
const mongodb_session = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')

//setting default template engine and template folder name
app.set('view engine', 'ejs')
app.set('views', 'views')

const db_url = 'mongodb+srv://root1:rootroot@cluster0.sdkrx.mongodb.net/userlogin' //db name userlogin

const userRoute = require('./router/user_route')


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
//static file serve: css, js

const session_store = new mongodb_session({uri:db_url, collection: 'session_data'})//storing sesion in mongodb

app.use(session({secret:'secrect string', store:session_store, saveUninitialized: true,resave: false, cookie: { maxAge: 60000 }}))

//using flash
app.use(flash())

const csrfProtect = csrf()
app.use(csrfProtect)


//passing values to every response
// app.use((req, res, next) => {
//     res.locals.isAuthenticated = req.session.isAuth;
//     res.locals.csrfToken = req.csrfToken();
//     next()
// })

//ROUTER
app.use(userRoute)
app.use((req,res,next)=>{
    res.send('<h1> 404 ERROR </h1>')
})


mongooes.connect(db_url,  {useNewUrlParser: true, useUnifiedTopology: true})
.then(
    result => {
        app.listen(8001)
        console.log('NodeJS is running')

    }
)