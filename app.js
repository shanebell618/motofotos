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
    image: String
});

var Photo = mongoose.model("Photo", photoSchema);

// Photo.create(
//     {name: "Andrew", image: "http://via.placeholder.com/200x200"},
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

app.get("/photos", function(req, res){
    //get all photos from db
    Photo.find({}, function(err, allPhotos){
        if(err){
            console.log(err);
        } else {
            res.render("photos", {photos: allPhotos});
        }
    });
});

app.post("/photos", function(req, res){
    //get data from form and add to photos
    var name = req.body.name;
    var image = req.body.image;
    var newPhoto = {name: name, image: image};
   
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

app.get("/photos/new", function(req, res) {
   res.render("new");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("motofotos server has started");
});

