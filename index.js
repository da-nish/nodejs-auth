const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express();

//setting default template engine and template folder name
app.set('view engine', 'ejs')
app.set('views', 'views')


const userRoute = require('./router/user_route')


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
//static file serve: css, js

//ROUTER
app.use(userRoute)
app.use((req,res,next)=>{
    res.send('<h1> 404 ERROR </h1>')
})

const mongo = require('./util/database').mongo_connect;

mongo( () => {
    app.listen(8001)
})

// app.listen(8001)
console.log('NodeJS is running')