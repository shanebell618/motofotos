var Photo = require("../models/photo");
var Comment = require("../models/comment");

//MIDDLEWARE

var middlewareObj = {};

//Check photo ownership
middlewareObj.checkPhotoOwnership = function(req, res, next){
    //check if user is logged in
    if(req.isAuthenticated()){
        Photo.findById(req.params.id, function(err, foundPhoto){
            if(err || !foundPhoto){
                req.flash("error", "Photo not found.");
                res.redirect("/photos");
            } else {
                //check if the user owns the photo
                if(foundPhoto.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You do not own this photo.")
                    res.redirect("back");
                }
                
            }
        });
    } else {
        req.flash("error", "You must be logged in.")
        res.redirect("back");
    }
};

//Check comment ownership
middlewareObj.checkCommentOwnership = function (req, res, next){
    //check if user is logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found.");
                res.redirect("back");
            } else {
                //check if the user owns the comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You do not own this comment.")
                    res.redirect("back");
                }
                
            }
        });
    } else {
        req.flash("error", "You must be logged in.");
        res.redirect("back");
    }
};

//Check if user is logged in
middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "You must be logged in.");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;