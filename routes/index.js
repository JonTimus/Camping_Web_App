var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user");


    // REST --> a Mapping between HTTP and CRUD

// Root Route
router.get("/", function(req, res){
    res.render("landing");
});


    // ==============
    //  AUTH ROUTES
    // ==============
    
    
// show register form
router.get("/register", function(req, res) {
     
    // Fixed Sign Up Error when Logged In
    if(req.user) {
        req.flash("error", "You are already Logged in, you cannot Register.");
        return res.redirect("back");
    }
    res.render("register", {page: 'register'}); 
});


// handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        avatar: req.body.avatar,
    });
    
    if(req.body.adminCode === "shitty_shit_1998"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", "Error: " + err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to CampApp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login", {page: 'login'});
});

// handle login logic
router.post("/login", passport.authenticate("local", { // Using 'passport.authenticate()' Middleware
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Welcome to CampApp!"
}), function(req, res) {
       
});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "See You Later!");    // --> req.flash("<key>", "<value>")
    res.redirect("/campgrounds");
});


// user's profiles
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("Something Went Wrong: ", "error");
            res.redirect("/");
        }
        //eval(require("locus"))
        res.render("users/show", {user: foundUser});
    });
});


module.exports = router;