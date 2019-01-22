var express = require("express");
var router = express.Router({mergeParams: true});
var Photo = require("../models/photo");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//NEW - show form to create new comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
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
router.post("/", middleware.isLoggedIn, function(req, res){
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

//EDIT - show edit comment form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        } else {
            Photo.findById(req.params.id, function(err, foundPhoto){
                if(err){
                    res.redirect("back");
                } else {
                res.render("comments/edit", {comment: foundComment, photo: foundPhoto});
                }
            });    
          }
    });
});

//UPDATE - update comment in db
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/photos/" + req.params.id);
        }
    })
});

//DESTROY - delete comment from db
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/photos/" + req.params.id);
        }
    })
});

module.exports = router;