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

//requiring routes    
var commentRoutes = require("./routes/comments"),
    photoRoutes   = require("./routes/photos"),
    indexRoutes   = require("./routes/index");


mongoose.connect("mongodb://localhost/motofotos");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//seed the db
//seedDB();

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

app.use(indexRoutes);
app.use("/photos", photoRoutes);
app.use("/photos/:id/comments", commentRoutes);








/*START SERVER*/
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("motofotos server has started");
});

