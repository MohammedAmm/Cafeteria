var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var products=new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    price:String,
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"categories"
    },
    img:String
});
//Register Model.....
mongoose.model("products",products);