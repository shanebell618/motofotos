require("dotenv").config();

var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    flash          = require("connect-flash"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Photo          = require("./models/photo"),
    Comment        = require("./models/comment"),
    User           = require("./models/user");
    //seedDB         = require("./seeds");

//requiring routes    
var commentRoutes = require("./routes/comments"),
    photoRoutes   = require("./routes/photos"),
    indexRoutes   = require("./routes/index");


mongoose.connect("mongodb://localhost");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
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

//pass current user and flash messages to all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use(indexRoutes);
app.use("/photos", photoRoutes);
app.use("/photos/:id/comments", commentRoutes);








/*START SERVER*/
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("motofotos server has started");
});

