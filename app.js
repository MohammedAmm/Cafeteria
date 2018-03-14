var express=require('express');
var server =express();
require('./models/products');
require('./models/users');
require('./models/categories');
require('./models/orders');

var authRoutes=require('./controllers/auth');
var categoryRoutes=require('./controllers/categories');
var usersRoutes=require('./controllers/users');
var productsRoutes=require('./controllers/products');
var ordersRoutes=require('./controllers/orders');

var mongoose=require('mongoose');
var session=require('express-session');
var flash=require('connect-flash');

mongoose.connect("mongodb://localhost:27017/cafeteria");
server.use(session({
    secret:"@#%#$^$%"
}));
server.use(express.static('public'))
server.use(flash());
server.use('/',authRoutes); 
server.use('/category',categoryRoutes); 
server.use('/users',usersRoutes);
server.use('/products',productsRoutes);
server.use('/orders',ordersRoutes);
server.get('/customer', function(req, res){
    res.sendFile(__dirname + '/test.html');
  });


 
// server.use(function (req,resp,next) {
//     if(!(req.session.username && req.session.password)){
//         resp.redirect('/auth/login');
//     }else{
//         next();
//     }
//   });

server.set('view engine','ejs');
server.set('views','./views');

var httServer=server.listen(9090,function () {console.log
("Starting at 9090 .....")  });
var io = require('socket.io').listen(httServer);
var admins=[];
io.on('connection', function(socket){
    console.log('a user connected');


    //default username
    socket.username="Anonymous";
    socket.on('user_data', function(data) {
        socket.username=data.username;
        socket.admin=data.admin;
        console.log(data);
        if(data.admin=="admin"){
            admins.push(socket.id);
            console.log(admins[0]);
            
        }
     });
    socket.on('request_order',function (data) {
        admins.forEach(function (admin) {
            io.sockets.to(admin).emit('client_order',data);
          })
    })
     
});
    