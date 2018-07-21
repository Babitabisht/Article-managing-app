const express=require('express');
const path =require('path');
const mongoose =require('mongoose');
const bodyParser=require('body-parser')

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
//Add Route
app.get('/articles/add',function(req,res){
    res.render('add_articles',{
        title:'add article'
    });
     

});

app.post('/articles/add' ,function(req, res){
  
  console.log('Form submitted');
  let article= new Article();
  article.title = req.body.title;
  console.log(req.body.title)
  article.author = req.body.author;
  console.log(req.body.author)
  article.body = req.body.body;
  article.save(function(err){
      if(err){
          console.log(err);
          return;
      }else{
          console.log('Redirecting.........')
          res.redirect('/');
          
      }
  });
 
    // res.render('add_articles',{
    //     title:'add article'
    // });
})

app.listen(3000,()=>{
console.log('app running successfully on port 3000');

})