var mongoose=require("mongoose");

var commentSchema=mongoose.Schema({
	text:String,
	author:String
});
var comment=mongoose.model("Comment",commentSchema);
module.exports=comment;
