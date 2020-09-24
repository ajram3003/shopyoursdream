const express = require('express');
//MongoDb connection,Promising and keys
const mongoose = require('mongoose');
const keys = require('./config/keys');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');
const charge = require('./routes/charge');
const bodyParser = require('body-parser');
const history = require('./routes/history');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const views = require('./routes/views');
const about = require('./routes/about');

//loading handlebar helpers 
const {divide , formatDate} = require('./helpers/hbs');

mongoose.Promise = global.Promise

//console.log(keys.mongoURI)

//console.log('kyess:: ',keys.mongoURI);

mongoose.connect(keys.mongoURI,{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(()=>{
    console.log('MongoDb connected :)')
}).catch(err=>{
    console.log('Network Failure :(')
})

const PORT =  process.env.PORT || 5000
const app = express()
const passport = require('passport')

//console.log('before')
require('./modal/users')
require('./config/passport')(passport)
//console.log('after')

//Load Routes

const auth = require('./routes/auth')
const route = require('./routes/index')
const exhbs = require('express-handlebars')
const dashboard = require('./routes/dashboard')
const stories = require('./routes/stories')
const uploads = require('./routes/uploads')
// app.get('/',(req,res)=>{
//     res.type('text/plain')
//     res.status(200).send('<h1>Ajay</h1>')
// })
//console.log('path : ',__dirname)
//console.log('new path :',path.join(__dirname,'\public','\static'))
//console.log('file : ')
//app.use(express.static(path.join(__dirname,'public'),'public'))
app.use(express.static(path.join(__dirname,'public')))

//view engine
app.engine('handlebars',exhbs({
    helpers : {
        divide : divide,
        formatDate : formatDate
    },
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout : 'main'
}))

app.set('view engine','handlebars')

//express session
app.use(cookieParser())

app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : false
}))

//Passport middlewarer
app.use(passport.initialize())

app.use(passport.session())

app.use('/auth',auth)

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());

app.use((req,res,next)=>{

   // console.log("THIS IS THE PATH ",req.path)
        
        res.locals.user = req.user;

      // console.log(req.user);

      //  res.locals.firstName = req.user.firstName;
        
        next()
})


app.use('/',route)

app.use('/dashboard',dashboard)

//app.use('/stories',stories)

app.use('/charge',charge);

app.use('/history',history);

app.use('/views',views);

app.use('/about',about);

//making upload

const storage = multer.diskStorage({
    destination : './public/uploads/',
    filename : function(req,file,cb){
        cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

//console.log('storage is ',typeof storage)

//initialize upload variable
const upload = multer({
    storage : storage,
}).single('myImage')

//console.log('upload :: ',typeof upload)


//app.use('/uploads',uploads);


app.listen(PORT,()=>console.log(`Running on PORT :: ${PORT}`))
/* This is my work and what is your work ? */

//mongodb+srv://<username>:<password>@poemreaders-86yrp.mongodb.net/test?retryWrites=true&w=majority
/*
const takeMyName = 'My name is Chauhan Ajaykumar.'
const expressFeelings = 'I am awesome'
const result = (function(){
    return takeMyName
})()
console.log(takeMyName) //My name is Chauhan Ajaykumar
*/

/* I am the wwe wrestler who are you */