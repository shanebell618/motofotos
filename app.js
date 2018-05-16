var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Photo         = require("./models/photo"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");


mongoose.connect("mongodb://localhost/motofotos");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "this is the secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//pass current user to all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX - show all photos
app.get("/photos", function(req, res){
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
app.post("/photos", function(req, res){
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
app.get("/photos/new", function(req, res) {
   res.render("photos/new");
});

//SHOW - shows more info about one photo
app.get("/photos/:id", function(req, res) {
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

//COMMENTS
app.get("/photos/:id/comments/new", isLoggedIn, function(req, res) {
    //find photo by id
    Photo.findById(req.params.id, function(err, photo){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {photo: photo});
        }
    })
});

app.post("/photos/:id/comments", isLoggedIn, function(req, res){
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
                  //connect new comment to photo
                  photo.comments.push(comment);
                  photo.save();
                  //redirect to photo show page
                  res.redirect("/photos/" + photo._id);
              }
          });
      }
   });
});

//AUTH ROUTES
//show register form
app.get("/register", function(req, res) {
    res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/photos");
            });
        }
    });
});

//show login form
app.get("/login", function(req, res) {
   res.render("login"); 
});

//handle login logic using middleware
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/photos",
        failureRedirect: "/login"
    }),
    function(req, res) {
});

//logout
app.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/photos");
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
};




/*START SERVER*/
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("motofotos server has started");
});

