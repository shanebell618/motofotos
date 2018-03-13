var express = require("express");
var app = express();

app.set("view engine", "ejs");


app.get("/", function(req, res){
    res.render("landing");
});

app.get("/photos", function(req, res){
    var photos = [
        {name: "Jeff", image: "https://pixabay.com/get/ea37b30f2cf7003ed1584d05fb1d4e97e07ee3d21cac104497f0c879a2e5b3bf_340.jpg"},
        {name: "Andrew", image: "https://cdn.pixabay.com/photo/2018/02/16/17/07/motocross-3158085_960_720.jpg"},
        {name: "Steve", image: "https://cdn.pixabay.com/photo/2018/03/06/20/45/bike-3204546_960_720.jpg"}
    ]
    
    res.render("photos", {photos: photos});
});




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("motofotos server has started");
});

