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
router.post("/", isLoggedIn, function(req, res){
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
router.get("/new", isLoggedIn, function(req, res) {
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
router.get("/:id/edit", checkPhotoOwnership, function(req, res) {
    Photo.findById(req.params.id, function(err, foundPhoto){
        if(err){
            res.redirect("/photos");
        } else {
                res.render("photos/edit", {photo: foundPhoto});
        }
    });
});

//UPDATE
router.put("/:id", checkPhotoOwnership, function(req, res){
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
router.delete("/:id", checkPhotoOwnership, function(req, res){
    Photo.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/photos");
        } else {
            res.redirect("/photos");
        }
    })
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
};

function checkPhotoOwnership(req, res, next){
        //is user logged in
        if(req.isAuthenticated()){
            Photo.findById(req.params.id, function(err, foundPhoto){
                if(err){
                    res.redirect("/photos");
                } else {
                    //does the user own the photo
                    if(foundPhoto.author.id.equals(req.user._id)){
                        next();
                    } else {
                        res.redirect("back");
                    }
                    
                }
            });
        } else {
            res.redirect("back");
        }
};

module.exports = router;