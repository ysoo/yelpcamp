var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")

router.get("/", function(req, res) {
  // res.render("campgrounds", {campgrounds: campgrounds});
  Campground.find({}, function(err, campgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: campgrounds
      });
    }
  })
});

// Create a new campground
router.post("/", isLoggedIn, function(req, res) {
  // get data from form and add to the campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {
    name: name,
    author: author,
    image: image,
    description: description
  }

  // Create a new campground and save to database
  // redirect back to the campgrounds page

  Campground.create(newCampground, function(err, newCamp) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
  // campgrounds.push(newCampground);
});

// Show form to create campground
router.get("/new", isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
}); // RESTful convention

router.get("/:id", function(req, res) {
  // Find the campground with provided //
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      // Render the show page
      res.render("campgrounds/show", {
        campground: foundCampground
      });
    }
  });

});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
