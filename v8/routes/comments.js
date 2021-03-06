var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Comments New
router.get("/new", isLoggedIn, function(req, res){
    // find campground by id
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

//Comments Create
router.post("/",isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {//
              //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               console.log("the username will be: "+ req.user.username)
               //save comment
               comment.save();
               campground.comments.push(comment);//wait

                Campground.update({_id: campground},{$push: {comments: comment}},function(err,UpdatedCampground){
                if (err){
                  console.log(err)
                }else{
                  console.log("campground saved")
                }
               });
               console.log("----->")
               console.log(comment);
               console.log(campground);
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;