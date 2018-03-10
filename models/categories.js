var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var categories=new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String
});
//Register Model.....
mongoose.model("categories",categories);