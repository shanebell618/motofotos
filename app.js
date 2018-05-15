var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Photo      = require("./models/photo"),
    Comment    = require("./models/comment"),
    seedDB     = require("./seeds");


mongoose.connect("mongodb://localhost/motofotos");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

seedDB();



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
app.get("/photos/:id/comments/new", function(req, res) {
    //find photo by id
    Photo.findById(req.params.id, function(err, photo){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {photo: photo});
        }
    })
});

app.post("/photos/:id/comments", function(req, res){
   //lookup photo using id
   Photo.findById(req.params.id, function(err, photo) {
      if(err){
          console.log(err);
          res.redirect("/photos");
      } else {
          Comment.create(req.body.comment, function(err, comment){
              if(err){
                  console.log(err);
              } else {
                  photo.comments.push(comment);
                  photo.save();
                  res.redirect("/photos/" + photo._id);
              }
          });
      }
   });
   //create new comment
   //connect new comment to photo
   //redirect to photo show page
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("motofotos server has started");
});

