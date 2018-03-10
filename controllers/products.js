var express=require('express');
var router=express.Router();
var bodyParser=require('body-parser');
var bodyParserMid=bodyParser.urlencoded();
var fs=require('fs');
var mongoose = require('mongoose');
var multer=require('multer');
var uploadMid=multer({
    dest:"./public/imgs"
});
var CategoryModel=mongoose.model('categories');
var ProductModel=mongoose.model('products');

router.get('/add',function (req,resp) {
    CategoryModel.find({},function(err,categories){
       resp.render('products/add',{categories:categories});        
    });

});
router.post('/add',bodyParserMid,function (req,resp) {
    var product = new ProductModel({
        _id:mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        category:req.body.category
        });
    product.save(function (err,doc) { 
        if(!err){
            resp.redirect("/products/list");
        }else{
            resp.json(err);
        }
        //resp.json(req.body);
     });
});
router.get('/list',function (req,resp) {
    ProductModel.find({})
    .sort({_id:-1})
    .populate({path:"category",select:"name"})
    .then(function (result,err) {
        if(result){
            resp.render('products/list',{data:result,msg:req.flash('msg')});     
        }
      });

});
router.get('/delete/:id',function (req,resp) {
    ProductModel.remove({_id:req.params.id},function (err,result) { 
        if(!err){
            req.flash("msg","Done");
            resp.redirect("/products/list");
        }      
     })
  });
  router.get('/edit/:id',function (req,resp) {
      var ncategories={};
    CategoryModel.find({},function(err,categories){
        ncategories=categories;        
     });
    ProductModel.findOne({_id:req.params.id},function (err,doc) {
        resp.render('products/edit',{obj:doc,categories:ncategories});
      })
  });
  router.post('/edit',bodyParserMid,function (req,resp) {
    ProductModel.update({_id:req.body._id},
       {"$set":{name:req.body.name,
        price:req.body.price,
        category:req.body.category}
    } 
    ,function (err,doc) { 
        console.log(doc);
        if (!err) {
         resp.redirect('/products/list');   
        }else{
            resp.json(err);
        }
     });
  });
module.exports = router;