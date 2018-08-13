var express = require("express");
var router = express.Router({mergeParams: true});
var Photo = require("../models/photo");
var Comment = require("../models/comment");


//NEW - show form to create new comment
router.get("/new", isLoggedIn, function(req, res) {
    //find photo by id
    Photo.findById(req.params.id, function(err, photo){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {photo: photo});
        }
    })
});

//CREATE - add new comment to db
router.post("/", isLoggedIn, function(req, res){
   //lookup photo using id
   Photo.findById(req.params.id, function(err, photo) {
      if(err){
          console.log(err);
          res.redirect("/photos");
      } else {
          //create new comment
          Comment.create(req.body.comment, function(err, comment){
              if(err){
                  console.log(err);
              } else {
                  //add username and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  //save comment
                  comment.save();
                  //connect new comment to photo
                  photo.comments.push(comment);
                  //save photo
                  photo.save();
                  //redirect to photo show page
                  res.redirect("/photos/" + photo._id);
              }
          });
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