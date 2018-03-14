var express=require('express');
var router=express.Router();
var bodyParser=require('body-parser');
var bodyParserMid=bodyParser.urlencoded();
var fs=require('fs');
var mongoose = require('mongoose');
var multer=require('multer');
var validator = require('node-validator');
var uploadMid=multer({
    dest:"./public/imgs"
});
var PostModel=mongoose.model('users');
router.get('/add',function (req,resp) {
    resp.render('users/add');

});
router.post('/add',bodyParserMid,function (req,resp) {
    console.log(req.body);
    var post = new PostModel({
        name:req.body.name,
        _id:req.body._id
    });

    post.save(function (err,doc) { 
        if(!err){
            resp.redirect("/users/list");
        }else{
            resp.json(err);
        }
        resp.json(req.body);
     });
    // resp.json(req.body);
    // resp.render('posts/add');
    // mongoose.model('posts').collection.insert({
    //     title:req.body.title,
    //     id:req.body.id
    // },function(err,doc){
    //     resp.json(req.body);
    // })

});
router.get('/list',function (req,resp) {
    PostModel.find({},function(err,result){
        if(!err){
            resp.render('users/list',{data:result,msg:req.flash('msg')});     
        }else{
            resp.json(err);
        }
    });
    // resp.render('users/list');

});
router.get('/delete/:id',function (req,resp) {
    PostModel.remove({_id:req.params.id},function (err,result) { 
        if(!err){
            req.flash("msg","Done");
            resp.redirect("/users/list");
        }
     })
  });
  router.get('/edit/:id',function (req,resp) {
    // PostModel.remove({id:req.params.id},function (err,result) { 
    //     if(!err){
    //         req.flash("msg","Done");
    //         resp.redirect("/posts/list");
    //     }
    //  })
    PostModel.findOne({_id:req.params.id},function (err,doc) {
        resp.render('users/edit',{obj:doc});
      })
    // resp.render('posts/edit')
  });
  router.post('/edit',bodyParserMid,function (req,resp) {
    // PostModel.remove({id:req.params.id},function (err,result) { 
    //     if(!err){
    //         req.flash("msg","Done");
    //         resp.redirect("/posts/list");
    //     }
    //  })
    // PostModel.findOne({_id:req.params.id},function (err,doc) {
    //     resp.render('posts/edit',{obj:doc});
    //   })
    // resp.render('posts/edit')
    PostModel.update({_id:parseInt(req.body._id)},
       {"$set":{name:req.body.name}} 
    ,function (err,doc) { 
        if (!err) {
         resp.redirect('/users/list');   
        }else{
            console.log(req.body);
            resp.json(err);
        }
     });
  });
module.exports = router;