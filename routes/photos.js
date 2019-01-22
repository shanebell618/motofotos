var express = require("express");
var router = express.Router();
var Photo = require("../models/photo");
var middleware = require("../middleware");


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
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to photos
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newPhoto = {name: name, image: image, description: desc, author: author};
   
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
router.get("/new", middleware.isLoggedIn, function(req, res) {
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

//EDIT
router.get("/:id/edit", middleware.checkPhotoOwnership, function(req, res) {
    Photo.findById(req.params.id, function(err, foundPhoto){
        if(err){
            res.redirect("/photos");
        } else {
                res.render("photos/edit", {photo: foundPhoto});
        }
    });
});

//UPDATE
router.put("/:id", middleware.checkPhotoOwnership, function(req, res){
    //find and update correct photo
    Photo.findByIdAndUpdate(req.params.id, req.body.photo, function(err, updatedPhoto){
        if(err){
            res.redirect("/photos");
        } else {
            //redirect to show page
            res.redirect("/photos/" + req.params.id);
        }
    });
});

//DESTROY
router.delete("/:id", middleware.checkPhotoOwnership, function(req, res){
    Photo.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/photos");
        } else {
            res.redirect("/photos");
        }
    })
});

module.exports = router;