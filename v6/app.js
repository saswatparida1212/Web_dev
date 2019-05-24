const port = 3000
var express = require("express"),
    app = express(),
    bodyParser=require("body-parser"),
    mongoose=require("mongoose"),
    passport=require("passport"),
    LocalStrategy=require("passport-local"),
    Campground=require("./models/campgrounds"),
    Comment=require("./models/comments"),
    User=require("./models/user"),
    seedDb=require("./seeds.js");
var commentRoutes=require("./routes/comments"),
    campgroundRoutes=require("./routes/campgrounds"),
    indexRoutes=require("./routes/index")

mongoose.connect("mongodb://localhost:27017/yelp_camp_v7",{useNewUrlParser:true});

  // Campground.create(
  //    {
  //        name: "Granite Hill", 
  //        image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
  //        description: "This is a huge granite hill, no bathrooms.  No water. Beautiful granite!"
         
  //    },
  //    function(err, campground){
  //     if(err){
  //         console.log(err);
  //     } else {
  //         console.log("NEWLY CREATED CAMPGROUND: ");
  //         console.log(campground);
  //     }
  //   });

app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"))
seedDb()
//Passport Config
app.use(require("express-session")({
  secret:"The tip of the shoelace is known as aglet",
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});
app.use("/",indexRoutes)
app.use("/campgrounds/:id/comments",commentRoutes)
app.use("/campgrounds",campgroundRoutes)
app.listen(port,function(){
  console.log(`server listening on port ${port}!`); 
});
