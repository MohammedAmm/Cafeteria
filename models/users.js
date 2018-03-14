var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var users = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    password: String,
    email: { type: String, required: true, unique: true },
    admin: Boolean,
    room_no: Number,
    ext: Number,
    img: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});
//Register Model.....
mongoose.model("users", users);