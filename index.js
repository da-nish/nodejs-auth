const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongooes = require('mongoose')
const app = express();
const session = require('express-session')


//setting default template engine and template folder name
app.set('view engine', 'ejs')
app.set('views', 'views')


const userRoute = require('./router/user_route')


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
//static file serve: css, js


app.use(session({secret:'secrect string', saveUninitialized: true,resave: false, cookie: { maxAge: 60000 }}))
//ROUTER
app.use(userRoute)
app.use((req,res,next)=>{
    res.send('<h1> 404 ERROR </h1>')
})



const db_url = 'mongodb+srv://root1:rootroot@cluster0.sdkrx.mongodb.net/userlogin' //db name userlogin
mongooes.connect(db_url,  {useNewUrlParser: true, useUnifiedTopology: true})
.then(
    result => {
        app.listen(8001)
        console.log('NodeJS is running')

    }
)