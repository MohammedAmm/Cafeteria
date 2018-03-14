var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var orders=new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    price:String,
    rooms:String,
    notes:String,
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products"
    }]
});
//Register Model.....
mongoose.model("orders",orders);