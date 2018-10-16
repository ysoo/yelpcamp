var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment")

// COMMENTS ROUTES

router.get("/campgrounds/:id/comments/new", isLoggedIn,  function(req, res) {
  // find campground by id
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err)
    } else {
      res.render("comments/new", {
        campground: campground
      });
    }
  })
});

router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
  // lookup campground using id
  // Create a new comment
  // Connect new comment to campgrounds
  // Redirect campground show page
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          // Add username and id to comment
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      })
    }
  })
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
