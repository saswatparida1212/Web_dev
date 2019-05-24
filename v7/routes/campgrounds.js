var express=require("express")
var router=express.Router()
var Campground=require("../models/campgrounds")
// INDEX route
router.get("/",function(req,res){
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
router.get("/new",function(req, res) {
    res.render("campgrounds/new");
});
router.get("/:id",function(req,res){
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
router.post("/", function(req, res){
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
module.exports=router