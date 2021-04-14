var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    User            = require("./models/user"),
    serveStatic     = require('serve-static'),
    seedDB          = require("./seeds");
    

// Requiring Routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index"); // or authRoutes
    

// MongoDB Config
mongoose.connect('mongodb://localhost:27017/yelp_camp_v10', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
serveStatic("./public/files");

//Method-Override
app.use(methodOverride("_method"));

app.use(flash());
//seedDB();


// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Sexy Photos",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// Importing Routes
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);
    

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Has Started!");
});

// db.collection.drop() --> deletes all files from database (collection - is a name a 'collection')