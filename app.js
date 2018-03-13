var express = require("expresss");
var app = express();



app.get("/", function(req, res){
    res.send("root page!");
});




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("motofotos server has started");
});

