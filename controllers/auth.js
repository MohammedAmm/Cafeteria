var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bodyParserMid = bodyParser.urlencoded();
var multer = require('multer');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var validator = require('validator');
var err = [];
var errL = [];
var uploadMid = multer({
    dest: "./public/imgs"
});

var UserModel = mongoose.model('users');
router.get('/login', function (req, resp) {
    if(!req.session.username){
        resp.render('auth/login', {
            msg: req.flash("msg"),
            err_msg: errL
        });
        errL = []; 
    }
});
router.post('/login', bodyParserMid, function (req, resp) {
    // errL = [];
    var useremail = req.body.email;
    var pass = req.body.password;
    var correctPassword;
    var emailValidation = validator.isEmail(useremail, { min: 8 });
    var passValidation1 = validator.matches(pass, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);
    var passValidation2 = validator.isByteLength(pass, { min: 8 });
    var imgValidation='';
    if (useremail == "" || pass == "") {
        req.flash("msg", "Email and Password is required");
        return resp.redirect('login');
        errL = [];
    }
    else {
        if (!emailValidation) {
            var emailerr = 'Email Is Invalid';
            errL.push(emailerr);
        }
        if (!passValidation1 || !passValidation2) {
            var passerr = "Password Is Invalid";
            errL.push(passerr);
        }
    }


    if (!errL) {
        console.log(errL);
        resp.redirect("login");
        errL = [];
    }
    else {
        UserModel.findOne({ email: req.body.email }, function (err, doc) {
            if (doc) {
                correctPassword = bcrypt.compareSync(req.body.password, doc.password);
                //  correctPassword?console.log("true"):console.log("false");
                if (correctPassword) {
                    req.session.useremail = useremail;
                    req.session.username = doc.name;
                    req.session._id = doc._id;
                    req.session.photo=doc.img;
                    req.session.admin=doc.admin; 
                    
                    //                    console.log(req.session.useremail);
                    if(req.session.admin)
                      return resp.redirect('orders/list');
                    else    
                       return resp.redirect('orders/add');

                        
                } else {
                    req.flash("msg", "password not correct");
                    return resp.redirect('login');
                }
            }
            else {
                req.flash("msg", "email not exits");
                return resp.redirect('login');
            }
        })
    }


});
router.get('/register', function (req, resp) {
    if(req.session.admin){
        resp.render('auth/register', {
            msg: req.flash("msg"),
            err_msg: err

        });
        err = [];
    }else{
        resp.redirect('/orders/add');
    }
});
//to compare hashed bcrypt.compareSync("my password", hash);

const server = express();
const base64image = require('base64-image');
const path = require('path');
const upload = multer({ dest: './public/imgs' });
server.post('/base64/:filename', base64image(path.join(__dirname, '/public/imgs')));
router.post('/register',  upload.single('avatar'), function (req, resp) {
        console.log(req.body.name);
        err = [];
        var username = req.body.name;
        var pass = req.body.password;
        var confpass = req.body.confpassword;
        var useremail = req.body.email;
        var room_no = req.body.room_no;
        var ext = req.body.ext;
        if (useremail == "" || pass == "" || username == "" || confpass == "" || room_no == "" || ext == "" || !req.file) {
            req.flash("msg", "All Feilds Are Required");
            return resp.redirect('register');
        }
        else {
            var nameValidation1 = validator.isAlpha(username);
            var nameValidation2 = validator.isLength(username, { min: 8 });
            var emailValidation = validator.isEmail(useremail, { min: 8 });
            var passValidation1 = validator.matches(pass, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);
            var passValidation2 = validator.isByteLength(pass, { min: 8 });
            var room_noValidation = validator.isInt(room_no, { min: 4 });
            var extValidation = validator.isInt(ext, { min: 4 });
            var nameerr, emailerr, passerr, confpasserr, room_noerr, exterr,imgerr = "";
            if(!req.file.mimetype.match('image.*')){
            // console.log("valide");
            imgerr="Not valide file type, image only allowed";
            }
            if (!nameValidation1 || !nameValidation2) {
                nameerr = 'Username Must Contain At Least 8 Characters And Only Characters';
                err.push(nameerr);
            }
            if (!passValidation1 || !passValidation2) {
                passerr = "Password Must Contain Lowercase Letter, Capital Letter,Numbers And At Least Be 8 Characters";
                err.push(passerr);

            }
            if (!emailValidation) {
                emailerr = 'Email is Invalid';
                err.push(emailerr);

            }
            if (pass != confpass) {
                confpasserr = "confirm password is not matched with password";
                err.push(confpasserr);
            }
            if (!room_noValidation) {
                room_noerr = "Room_no is Invalid";
                err.push(room_noerr);

            }
            if (!room_noValidation) {
                room_noerr = "Room_no is Invalid";
                err.push(room_noerr);

            }
            if (!extValidation) {
                exterr = "EXT is Invalid";
                err.push(exterr);

            }
            if(imgerr){
                err.push(imgerr);

            }

        }
        if (err.length > 0) {
            console.log(err);
            resp.redirect("register");
        }
        else {
            console.log('test1');
            var hash = bcrypt.hashSync(req.body.password, 10);
            var newUser = new UserModel({
                _id: mongoose.Types.ObjectId(),
                name: req.body.name,
                password: hash,
                email: req.body.email,
                room_no: parseInt(req.body.room_no),
                ext: parseInt(req.body.ext),
                img: req.file.filename,
            });
            newUser.save(function (addError, doc) {
                if (!addError) {
                    resp.redirect('/orders/list');
                } else {
                    //resp.json(addError);
                    switch (addError.code) {
                        case 11000:
                            err.push("Email already exits");
                            return resp.redirect('register');
                            break;

                        default:
                            err.push("Email already exits");
                            return resp.redirect('register');
                            break;
                    }
                }
            });
        }
});
router.get('/logout', function (req, resp) {
    req.session.destroy(function () {
        resp.redirect('login');
    })
})
module.exports = router;
