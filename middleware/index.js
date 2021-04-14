var CampGround  = require("../models/campground");
var Comment     = require("../models/comment");

// All Middlewares Goes Here
var middlewareObj = {};


// Middleware Function For Checking Campground Ownership
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    // check if user is logged in
        if(req.isAuthenticated()){
            CampGround.findById(req.params.id, function(err, foundCampground){
                if(err || !foundCampground){ // Fixed Error Handling
                    console.log(err);
                    req.flash("error", "Campground Not Found");
                    res.redirect("back");
                }else{
                    // checking whether user own campground by comparing "author's id" and "user's id"
                    if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                        next();
                    }else{
                       req.flash("error", "You do not have permission to do that");
                       res.redirect("back");
                    }
                }
            });
        }
        else{
            req.flash("error", "You need to be Logged in to do that");
            res.redirect("back"); // 'back' --> redirects to the previous page
        }
};


// Middleware Function For Checking Comment Ownership
middlewareObj.checkCommentOwnership = function(req, res, next){
    // check if user is logged in
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err || !foundComment){ // Fixed Handling Error
                    console.log(err);
                    req.flash("error", "Comment Not Found!");
                    res.redirect("back");
                }else{
                    // checking whether user own comment by comparing "author's id" and "user's id"
                    if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                        next();
                    }else{
                       req.flash("error", "You do not have permission to do that");
                       res.redirect("back");
                    }
                }
            });
        }
        else{
            req.flash("error", "You need to be Logged in to do that");
            res.redirect("back"); // 'back' --> redirects to the previous page
        }
};


// Middleware Function For Checking Whether The User is Logged In or Not
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be Logged in to do that");  // --> req.flash("<key>", "<value>")
    res.redirect("/login");
};



module.exports = middlewareObj;