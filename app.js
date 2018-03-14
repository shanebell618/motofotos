var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//TEMP ARRAY
var photos = [
    {name: "Jeff", image: "http://via.placeholder.com/200x200"},
    {name: "Andrew", image: "http://via.placeholder.com/200x200"},
    {name: "Steve", image: "http://via.placeholder.com/200x200"}
];
//TEMP ARRAY

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/photos", function(req, res){
    res.render("photos", {photos: photos});
});

app.post("/photos", function(req, res){
    //get data from form and add to photos
    var name = req.body.name;
    var image = req.body.image;
    var newPhoto = {name: name, image: image};
    photos.push(newPhoto);
    
    //redirect back to photos page
    res.redirect("/photos");
});

app.get("/photos/new", function(req, res) {
   res.render("new");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("motofotos server has started");
});

