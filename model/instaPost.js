// required modules
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var instaPostSchema = new Schema({
	"userId" : {type:mongoose.Schema.Types.ObjectId,default :""},
	"postImage" : {type:String, default:""},
	"content" : {type:String, default:""},
	"deleteStatus" : {type:Number,default:0}
})
module.exports = mongoose.model('posts', instaPostSchema, 'posts');