var express = require("express");
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

// Comments New
router.get("/new", middleware['isLoggedIn'], function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if (err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// Comments Create
router.post("/", middleware['isLoggedIn'], function(req, res){
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                } else {
                    // add username and id to comment
                    console.log("New comment's username will be: " + req.user.username);
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    console.log(comment);
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// COMMENT EDIT
router.get("/:comment_id/edit", middleware['checkCommentOwnership'], (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// COMMENT UPDATE
router.put("/:comment_id/", middleware['checkCommentOwnership'], (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// COMMENT DESTROY
router.delete("/:comment_id", middleware['checkCommentOwnership'], (req, res) => {
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;