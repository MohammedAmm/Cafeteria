var express=require('express');
var router=express.Router();
var bodyParser=require('body-parser');
var bodyParserMid=bodyParser.urlencoded();
var multer=require('multer');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var uploadMid=multer({
    dest:"./public/imgs"
});

var UserModel=mongoose.model('users');
router.get('/login',function (req,resp) {
    resp.render('auth/login',{
        msg:req.flash("msg")
    });


});
router.post('/login',bodyParserMid,function (req,resp) {
    var username=req.body.name;
    var pass=req.body.password;
    var correctPassword;
    UserModel.findOne({email:req.body.email},function (err,doc) {
        if(doc){
           correctPassword= bcrypt.compareSync(req.body.password,doc.password);
         //  correctPassword?console.log("true"):console.log("false");
           if(correctPassword){
            return resp.redirect('products/list');
           }else{
            req.flash("msg","password not correct");
            return resp.redirect('login');
           }
        }
        else{
            req.flash("msg","email not exits");
            return resp.redirect('login');
                }
    })
    

});
router.get('/register',function (req,resp) {
    resp.render('auth/register',{
        msg:req.flash("msg"),
        err_msg:req.flash("err_msg")

    });
});
//to compare hashed bcrypt.compareSync("my password", hash);
router.post('/register',bodyParserMid,function (req,resp) {
    // console.log(req.body);
    var hash = bcrypt.hashSync(req.body.password, 10);
    var newUser = new UserModel({
        _id:mongoose.Types.ObjectId(),
        name:req.body.name,
        password:hash,
        email:req.body.email,        
        room_no:parseInt(req.body.room_no),
        ext:parseInt(req.body.ext),
    });

    newUser.save(function (err,doc) { 
        if(!err){
            resp.redirect("login");
        }else{
            //resp.json(err);
            switch (err.code) {
                case 11000:
                    req.flash("err_msg","email already exits");
                    return resp.redirect('register');
                    break;
            
                default:
                req.flash("err_msg","email already exits");
                return resp.redirect('register');
                    break;
            }
        }
        resp.json(req.body);
     });

});
router.get('/logout',function (req,resp) {
    req.session.destroy(function () { 
        resp.redirect('login');
     })
  })

module.exports = router;