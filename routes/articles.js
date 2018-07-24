 const express = require('express');
 const router = express.Router();


//Bring in Article Model
 let Article=require('../models/articles')
 let User=require('../models/user')



 //Add Article Route
router.get('/add',ensureAuthenticated,function(req,res){
    console.log('This is user :'+req.user);
    res.render('add_articles',{
        title:'add article' ,
        user:req.user
    });
     

});

// add article submitting form data to db
router.post('/add' ,function(req, res){
  
req.checkBody('title' , 'title is required').notEmpty();
// req.checkBody('author' , 'Author name is required').notEmpty();
req.checkBody('body' , 'please write an article before submission').notEmpty();

let errors =req.validationErrors();

if(errors){
    res.render('add_articles',{
        title:'Add article',
        errors:errors
    });
}
else{
    console.log('Form submitted');
    let article= new Article();
    article.title = req.body.title;
    console.log(req.body.title)
    article.author = req.user._id;
    //console.log(req.body.author)
    article.body = req.body.body;
    article.save(function(err){
        if(err){
            console.log(err);
            return;
        }else{
          req.flash("success", "Article Added Successfully");
            console.log('Redirecting.........')
            res.redirect('/');
            
        }
    });
}


    // res.render('add_articles',{
    //     title:'add article'
    // });
})

//get  single article
router.get('/:id',function(req,res){
Article.findById(req.params.id,function(err,article){

    User.findById(article.author , function(err,user){
// console.log(article);
    // return;
    console.log(user.name)
    res.render('article',{
        article:article,
        author:user.name,
        user:req.user //added later by me//check it out //problem is here
    });

    })


    
     
})

})

// Edit article route
router.get('/edit/:id',ensureAuthenticated,function(req,res){
    Article.findById(req.params.id,function(err,article){
        // console.log(article);
        // return;

        if(article.author !=req.user._id){
            req.flash('danger','unauthorized access')
            res.redirect('/')
        }
        res.render('edit_article',{
        
            article : article
        });
         
    })
    
    })

//saving Edit Article
// add article submitting form data to db
router.post('/edit/:id' ,function(req, res){
  
    console.log('Form submitted');
    console.log(req.params.id)
    let article= {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
let query={ _id:req.params.id}
console.log(query);
    Article.update(query,article,function(err){
        if(err){
            console.log(err);
            return;
        }else{
            req.flash('success','article edited successfully !')
            console.log('Redirecting.........')
            res.redirect('/');
            
        }
    });
   
      // res.render('add_articles',{
      //     title:'add article'
      // });
  })

//deleting Article

router.delete('/:id', ensureAuthenticated,function(req,res){

if(!req.user._id){
    res.status(500).send();
}

    let query = { _id:req.params.id}

Article.findById(req.params.id,function(err,article){

    if(article.author !=req.user._id){
        res.status(500).send();
    }else{Article.remove(query,function(err){
        if(err){
            console.log(err);
        }
        res.send('success')
        req.flash('success','article deleted successfully...!!')
            })}
})

    
});


function ensureAuthenticated(req,res,next){
if(req.isAuthenticated()){
    return next();
}else{
    req.flash('danger','Please Login');
    res.redirect('/users/login');
}

}


module.exports = router;
