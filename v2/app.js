const port = 3000
var express = require("express"),
    app = express(),
    bodyParser=require("body-parser"),
    mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true});
var campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String
});
var Campground =mongoose.model("Campground",campgroundSchema);
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
                res.render("index",{campgrounds:campgrounds})
            }
        })
        // res.render("campgrounds",{campgrounds:campgrounds})
})
// NEW route
app.get("/campgrounds/new",function(req, res) {
    res.render("new");
});
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("show",{campground:foundCampground});
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



app.listen(port,function(){
  console.log(`server listening on port ${port}!`); 
});