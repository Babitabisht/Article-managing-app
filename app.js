const express=require('express');
const path =require('path');
const mongoose =require('mongoose');
const bodyParser=require('body-parser');
const expressValidator=require('express-validator');
const flash=require('connect-flash');
const session=require('express-session');

const app =express();

mongoose.connect('mongodb://localhost/Articles');
let  db=mongoose.connection;


db.once('open',()=>{
    console.log('Connected to mongodb');
})
//check for db errors

db.on('error',function(err){
    console.log(err);
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



let Article=require('./models/articles')

app.set('views',path.join(__dirname,'views'))
app.set('view engine','pug')


app.use(express.static(path.join(__dirname,'public')))




//Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  
  }))

  //Express Messages Middleware
  app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express code acts as a middleware

app.use(expressValidator());



let articles = require('./routes/articles') ;
app.use('/articles',articles);






//home
app.get('/',(req ,res)=>{
// let articles =[{
// id:1,
// title:'Article 1',
// author:'Babita Bisht',
// body:'This is article one'

// },
// {
//     id:2,
//     title:'Article 2',
//     author:'ritik Bisht',
//     body:'This is article two'
    
//     },{
//         id:1,
//         title:'Article 3',
//         author:'Mansi rawat',
//         body:'This is article Four'
        
//         }
// ]

//index route (where all articles reside)
Article.find({}, (err ,articles)=>{

    if(err){
        console.log(err);
    }else{
        res.render('index',{
            title:'Articles',
            articles:articles
        });
    }
    

})

 
})


app.listen(3000,()=>{
console.log('app running successfully on port 3000');

})