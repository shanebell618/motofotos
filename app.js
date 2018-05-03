var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Photo      = require("./models/photo"),
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
            res.render("index", {photos: allPhotos});
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
   res.render("new");
});

//SHOW - shows more info about one photo
app.get("/photos/:id", function(req, res) {
    //find the photo with provided ID
    Photo.findById(req.params.id).populate("comments").exec(function(err, foundPhoto){
        if(err) {
           console.log(err);
       } else {
           //render show template with that photo
           res.render("show", {photo: foundPhoto});
       }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("motofotos server has started");
});

