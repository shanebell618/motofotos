var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost/motofotos");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//SCHEMA SETUP
var photoSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Photo = mongoose.model("Photo", photoSchema);

// Photo.create(
//     {
//         name: "Andrew", 
//         image: "http://via.placeholder.com/200x200",
//         description: "This is a demo description"
//     },
//     function(err, photo){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("photo added");
//             console.log(photo);
//         }
//     });

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
    Photo.findById(req.params.id, function(err, foundPhoto){
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

