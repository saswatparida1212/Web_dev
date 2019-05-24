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

mongoose.connect("mongodb://localhost:27017/yelp_camp_v6",{useNewUrlParser:true});

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
// home page
app.get("/",function(req,res){
    res.render("landing");
    
})

// INDEX route
app.get("/campgrounds",function(req,res){
        // Get all the campgrounds:
        Campground.find({},function(err,campgrounds){
            if(err){
                console.log(err);
            }else{
                res.render("campgrounds/index",{campgrounds:campgrounds,currentUser:req.user})
            }
        })
        // res.render("campgrounds",{campgrounds:campgrounds})
})
// NEW route
app.get("/campgrounds/new",function(req, res) {
    res.render("campgrounds/new");
});
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground)
            res.render("campgrounds/show",{campground:foundCampground});
        }
    })
    

})
// CREATE Route
app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc =req.body.description;
    var newCampground = {name: name, image: image,description:desc}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// ===========================
// COMMENT ROUTES
// ===========================
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
  Campground.findById(req.params.id,function(err,campground){
    if(err){
      console.log(err)
    }else{
      res.render("comments/new",{campground:campground})
    }
  })
})
app.post("/campgrounds/:id/comments",isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});
// ==========
// AUTH ROUTE
// ==========
// show register form
app.get("/register",function(req,res){
  res.render("register")
})
// post route
app.post("/register",function(req,res){
  var newUser=new User({username:req.body.username})
  User.register(newUser,req.body.password,function(err,user){
    if(err){
      console.log(err)
      return res.render("register")
    }
    passport.authenticate("local")(req,res,function(){
      res.redirect("/campgrounds")
    })
  })
})
// show login form
app.get("/login",function(req,res){
	res.render("login")
})
// handeling login logic
app.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRediect:"/login"
	}),function(req,res){
})
// logout route
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/campgrounds");
})
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login")
}
app.listen(port,function(){
  console.log(`server listening on port ${port}!`); 
});
