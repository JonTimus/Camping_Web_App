var express     = require("express"),
    router      = express.Router(),
    CampGround  = require("../models/campground");

//MiddleWare
var middleware  = require("../middleware");


    //  ========================
    //     CAMPGROUND ROUTES
    //  ========================


// INDEX Route --> show all campgrounds
router.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB and add it
    CampGround.find({}, function(err, all_camp_grs){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: all_camp_grs, page: 'campgrounds'});
        }
    });
});

// CREATE Route --> add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newCampground = {
        name: name, 
        image: image,
        price: price,
        description: description,
        author: author
    };

    // Create a New campGround and save that to DB
    CampGround.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            // redirect back to campgrounds page
            req.flash("success", "Successfully Created Campground!");
            res.redirect("/campgrounds");
        }
    });
});


// NEW Route --> show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});


// SHOW Route --> shows more info about one campground
router.get("/campgrounds/:id", function(req, res) { // :id --> variable
    // find the campground with provided ID
    CampGround.findById(req.params.id).populate("comments").exec(function(err, foundCampground){  // --> CampGround.findById(id, callback)
        if(err || !foundCampground){ // Fixed Handling Error
            console.log(err);
            req.flash("error", "Campground Not Found!");
            res.redirect("back");
        }else{
           console.log(foundCampground);
           // render show template with that campground
           res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT Campground Route
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    CampGround.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Campground Does Not Exist!");
            res.redirect("back");
        }
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});


// UPDATE Campground Route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update correct campground
    CampGround.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            // and redirect to the show page
            req.flash("success", "You Have Updated the Campground!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY Campground Route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and delete correct campground
    CampGround.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            // and redirect to the show page
            req.flash("success", " You Have Deleted the Campground");
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;