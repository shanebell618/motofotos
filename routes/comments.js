var express = require("express");
var router = express.Router({mergeParams: true});
var Photo = require("../models/photo");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//NEW - show form to create new comment
router.get("/new", middleware.isLoggedIn, function(req, res){
    Photo.findById(req.params.id, function(err, photo){
        if(err || !photo){
            req.flash("error", "Photo not found");
            res.redirect("back");
        } else {
            res.render("comments/new", {photo: photo});            
        }
    });
});

//CREATE - add new comment to db
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup photo using id
   Photo.findById(req.params.id, function(err, photo) {
      if(err){
          console.log(err);
          req.flash("error", "Photo not found.");
          res.redirect("/photos");
      } else {
          //create new comment
          Comment.create(req.body.comment, function(err, comment){
              if(err){
                  req.flash("error", "Error creating comment.");
                  res.redirect("back");
              } else if(comment.text.length === 0) {
                    req.flash("error", "Comment cannot be empty.");
                    res.redirect("back");
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
                  req.flash("success", "Comment added!");
                  res.redirect("/photos/" + photo._id);
              }
          });
      }
   });
});

//EDIT - show edit comment form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Photo.findById(req.params.id, function(err, foundPhoto) {
       if(err || !foundPhoto){
           req.flash("error", "Photo not found.");
           return res.redirect("back");
       }
       Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           } else {
               res.render("comments/edit", {campground_id: req.params.id, comment: foundComment, photo: foundPhoto});
           }
       });
   });
});

//UPDATE - update comment in db
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error", "Comment not found.");
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated!");
            res.redirect("/photos/" + req.params.id);
        }
    })
});

//DESTROY - delete comment from db
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Comment not found.");
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/photos/" + req.params.id);
        }
    })
});

module.exports = router;