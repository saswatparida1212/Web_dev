var mongoose=require("mongoose")
var passportlocalmongoose=require("passport-local-mongoose")
var UserSchema=new mongoose.Schema({
	username:String,
	Password:String
});
UserSchema.plugin(passportlocalmongoose)
var User =mongoose.model("User",UserSchema);
module.exports=User;