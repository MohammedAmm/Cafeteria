var express=require('express');
var server =express();
require('./models/products');
require('./models/users');
require('./models/categories');
var authRoutes=require('./controllers/auth');
var categoryRoutes=require('./controllers/categories');
var usersRoutes=require('./controllers/users');
var productsRoutes=require('./controllers/products');
var mongoose=require('mongoose');
var session=require('express-session');
var flash=require('connect-flash');
mongoose.connect("mongodb://localhost:27017/cafeteria");

server.use(session({
    secret:"@#%#$^$%"
}));
server.use(flash());
server.use('/',authRoutes); 
server.use('/category',categoryRoutes); 
server.use('/users',usersRoutes);
server.use('/products',productsRoutes);
 
// server.use(function (req,resp,next) {
//     if(!(req.session.username && req.session.password)){
//         resp.redirect('/auth/login');
//     }else{
//         next();
//     }
//   });

server.set('view engine','ejs');
server.set('views','./views');

server.listen(9090,function () {console.log
("Starting at 9090 .....")  });