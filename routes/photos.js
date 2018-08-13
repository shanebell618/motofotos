var express = require("express");
var router = express.Router();
var Photo = require("../models/photo");


//INDEX - show all photos
router.get("/", function(req, res){
    //get all photos from db
    Photo.find({}, function(err, allPhotos){
        if(err){
            console.log(err);
        } else {
            res.render("photos/index", {photos: allPhotos});
        }
    });
});

//CREATE - add new photo to db
router.post("/", function(req, res){
    //get data from form and add to photos
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newPhoto = {name: name, image: image, description: desc};
   
    //create a new photo and save to db
    Photo.create(newPhoto, function(err, newlyCreated){
       if(err) {
           console.log(err);
       } else {
           //redirect back to photos page
           res.redirect("/photos");
       }
   }); 
});

//NEW - show form to create new photo
router.get("/new", function(req, res) {
   res.render("photos/new");
});

//SHOW - shows more info about one photo
router.get("/:id", function(req, res) {
    //find the photo with provided ID
    Photo.findById(req.params.id).populate("comments").exec(function(err, foundPhoto){
        if(err) {
           console.log(err);
       } else {
           //render show template with that photo
           res.render("photos/show", {photo: foundPhoto});
       }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
};


module.exports = router;