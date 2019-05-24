const port = 3000
var express = require("express");
var app = express();
var bodyParser=require("body-parser")
var campgrounds = [
        {name: "Salmon creek", image:"https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Ridge Creek", image:"https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Granite Hills", image:"https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon creek", image:"https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Ridge Creek", image:"https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Granite Hills", image:"https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
        ]
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended: true}));
// home page
app.get("/",function(req,res){
    res.render("landing");
    
})

// campgrounds
app.get("/campgrounds",function(req,res){
    
        res.render("campgrounds",{campgrounds:campgrounds})
})
app.get("/campgrounds/new",function(req, res) {
    res.render("new");
})
app.post("/campgrounds",function(req,res){
     //get data from form and add to campgrounds array
    var name = req.body.name;
    var image= req.body.image;
    var newCampground={name:name,image:image};
    campgrounds.push(newCampground);
    // redirect to campgrounds page
    res.redirect("/campgrounds");
    
});









app.listen(port,function(){
  console.log(`server listening on port ${port}!`); 
})