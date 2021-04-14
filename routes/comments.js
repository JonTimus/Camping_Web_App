var express     = require("express"),
    router      = express.Router(),
    CampGround  = require("../models/campground"),
    Comment     = require("../models/comment");
    
//MiddleWare
var middleware  = require("../middleware");


    //  ========================
          // COMMENTS ROUTES
    //  ========================


// Comments NEW Route
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    // Find campground by id
    CampGround.findById(req.params.id, function(err, campGr){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campGr});
        }
    });
});

// Comments CREATE Route
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    // look up campground using ID
    CampGround.findById(req.params.id, function(err, campGr) {
        if(err || !campGr){
            console.log(err);
            req.flash("error", "Comment Not Found");
            res.redirect("/campgrounds");
        }else{
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Oops, Something Went Wrong!");
                    console.log(err);
                }else{
                     // add username and id to comments
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                     // save comment
                    comment.save();
                     // connect new comment to campground
                    campGr.comments.push(comment);
                    campGr.save();
                    console.log(comment);
                     // redirect to the SHOW page
                    req.flash("success", "Successfully Added Comment!");
                    res.redirect("/campgrounds/" + campGr._id);
                }
            });
        }
    });
});


// Comments EDIT Route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    CampGround.findById(req.params.id, function(err, foundCampground){ // Fixed Handling Error
        if(err || ! foundCampground){
            console.log(err);
            req.flash("error", "Campground Not Found");
            res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
                console.log(err);
                res.redirect("back");
            }else{
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});


// Comments UPDATE Route
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            // and redirect to the show page
            req.flash("success", "Successfully Updated Comment!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// Comments DESTROY Route
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            // and redirect to the show page
            req.flash("error", "Comment Deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;