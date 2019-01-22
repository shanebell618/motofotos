var Photo = require("../models/photo");
var Comment = require("../models/comment");

//MIDDLEWARE

var middlewareObj = {};

middlewareObj.checkPhotoOwnership = function(req, res, next){
    //check if user is logged in
    if(req.isAuthenticated()){
        Photo.findById(req.params.id, function(err, foundPhoto){
            if(err){
                res.redirect("/photos");
            } else {
                //check if the user owns the photo
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

middlewareObj.checkCommentOwnership = function (req, res, next){
    //check if user is logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                //check if the user owns the comment
                if(foundComment.author.id.equals(req.user._id)){
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

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
};

module.exports = middlewareObj;