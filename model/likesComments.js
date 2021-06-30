// required modules
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var likePostSchema = new Schema({
	"userId" : {type:mongoose.Schema.Types.ObjectId,default :""},
	"receiverId" : {type:mongoose.Schema.Types.ObjectId,default :""},
	"postId" : {type:mongoose.Schema.Types.ObjectId,default :""},
	"comment" : {type:String, default:""},
	"like" : {type:Number, default:0}
})
module.exports = mongoose.model('likesComments', likePostSchema, 'likesComments');