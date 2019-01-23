var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Root Route
router.get("/", function(req, res){
    res.render("landing");
});



//AUTH ROUTES
//show register form
router.get("/register", function(req, res) {
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register", {"error": err.message});
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to MotoFotos, " + user.username + "!");
                res.redirect("/photos");
            });
        }
    });
});

//show login form
router.get("/login", function(req, res) {
   res.render("login");
});

//handle login logic using middleware
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/photos",
        successFlash: 'Welcome back!',
        failureRedirect: "/login",
        failureFlash: true
    }),
    function(req, res) {
});

//logout
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "You have been logged out.")
   res.redirect("/photos");
});



module.exports = router;