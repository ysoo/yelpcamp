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

// Edit campground routes
router.get("/:id/edit", currentLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      res.redirect("/campgrounds")
    } else {
      res.render("campgrounds/edit", {
        campground: foundCampground
      });
    }
  });
});

// Update campground routes
router.put("/:id", function(req, res) {
  // find and update correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
})

router.delete("/:id", currentLoggedIn, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function currentLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      if (err) {
        res.redirect("back");
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

module.exports = router;
