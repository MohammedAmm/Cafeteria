var express=require('express');
var router=express.Router();
var bodyParser=require('body-parser');
var bodyParserMid=bodyParser.urlencoded();
var fs=require('fs');
var mongoose = require('mongoose');
var multer=require('multer');
var CategoryModel=mongoose.model('categories');

router.get('/add',function (req,resp) {
    resp.render('categories/add',{ msg:req.flash("msg")});        

});
    // var CategoryModel=mongoose.model('posts');

router.post('/add',bodyParserMid,function (req,resp) {
    var categoryname=req.body.name;
    if(categoryname==""){
        req.flash("msg","Category Feilds Is Required");
        return resp.redirect('add');
    }else{
        var newCategory = new CategoryModel({
            _id:mongoose.Types.ObjectId(),
            name:req.body.name,
            });
        newCategory.save(function (err,doc) { 
            if(!err){
                resp.redirect("/category/list");
            }else{
                resp.json(err);
            }
        });
    }
});
router.get('/list',function (req,resp) {
    CategoryModel.find({})
    .sort({_id:-1})
    .populate({path:"user",select:"name"})
    .then(function (result,err) {
        if(result){
            resp.render('categories/list',{data:result,msg:req.flash('msg')});     
        }
      });
});
router.get('/delete/:id',function (req,resp) {
    CategoryModel.remove({_id:req.params.id},function (err,result) { 
        if(!err){
            req.flash("msg","Done");
            resp.redirect("/category/list");
        }      
     })
  });
  router.get('/edit/:id',function (req,resp) {
    CategoryModel.findOne({_id:req.params.id},function (err,doc) {
        resp.render('categories/edit',{obj:doc});
      })
  });
  router.post('/edit',bodyParserMid,function (req,resp) {
    CategoryModel.update({_id:req.body._id},
       {"$set":{name:req.body.name}} 
    ,function (err,doc) { 
        console.log(doc);
        if (!err) {
         resp.redirect('/category/list');   
        }else{
            resp.json(err);
        }
     });
  });
module.exports = router;