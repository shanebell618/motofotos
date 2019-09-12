var express = require("express");
var router = express.Router();
var Photo = require("../models/photo");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);


//INDEX - show all photos
router.get("/", function(req, res){
    //get all photos from db
    Photo.find({}, function(err, allPhotos){
        if(err){
			return err;
        } else {
            res.render("photos/index", {photos: allPhotos});
        }
    });
});

//NEW - show form to create new photo
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("photos/new");
});

//CREATE - add new photo to db
router.post("/", middleware.isLoggedIn, function (req, res) {
	//get data from form and add to photos
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
		    console.log(err);
			req.flash('error', 'Invalid address');
			return res.redirect('back');
		}
		var lat = data[0].latitude;
		var lng = data[0].longitude;
		var location = data[0].formattedAddress;
		var newPhoto = {
			name: name,
			price: price,
			image: image,
			description: desc,
			author: author,
			location: location,
			lat: lat,
			lng: lng
		};

		//create a new photo and save to db
		Photo.create(newPhoto, function (err, newlyCreated) {
			if (err) {
				req.flash("error", "Failed to create photo.");
				res.redirect("/photos");
			} else {
				//redirect back to photos page
				req.flash("success", "Photo added!");
				res.redirect("/photos");
			}
		});
	});
});



//SHOW - shows more info about one photo
router.get("/:id", function(req, res) {
    //find the photo with provided ID
    Photo.findById(req.params.id).populate("comments").exec(function(err, foundPhoto){
        if(err || !foundPhoto) {
           req.flash("error", "Photo not found.");
           res.redirect("/photos");
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
            req.flash("error", "Edit failed.");
            res.redirect("/photos");
        } else {
                res.render("photos/edit", {photo: foundPhoto});
        }
    });
});

//UPDATE
router.put("/:id", middleware.checkPhotoOwnership, function (req, res) {
	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
			console.log(err);
			req.flash('error', 'Invalid address');
			return res.redirect('back');
		}
		req.body.photo.lat = data[0].latitude;
		req.body.photo.lng = data[0].longitude;
		req.body.photo.location = data[0].formattedAddress;

		//find and update correct photo
		Photo.findByIdAndUpdate(req.params.id, req.body.photo, function (err, updatedPhoto) {
			if (err) {
				req.flash("error", "Update failed.");
				res.redirect("/photos");
			} else {
				//redirect to show page
				req.flash("success", "Photo updated!");
				res.redirect("/photos/" + req.params.id);
			}
		});
	//});
});

//DESTROY
router.delete("/:id", middleware.checkPhotoOwnership, function(req, res){
    Photo.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Delete failed.");
            res.redirect("/photos");
        } else {
            req.flash("success", "Photo deleted.");
            res.redirect("/photos");
        }
    })
});

module.exports = router;