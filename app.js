var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var commentRoutes = require("./routes/comments");
    campgroundRoutes = require("./routes/campgrounds");
    indexRoutes = require("./routes/index");
var methodOverride = require("method-override");


// seedDB()

//mongoose.connect('mongodb://localhost/yelp_camp');
mongoose.connect('mongodb://severussnape:harry1@ds019766.mlab.com:19766/yelpcamp95')
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "YAY ME",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
})

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(commentRoutes);

// Campground.create(
//   {
//     name:"Rocky Mountains",
//     image: "ttps://c1.staticflickr.com/9/8002/7299820870_e78782c078_b.jpg"
//   }, function(err, campground) {
//     if(err) {
//       console.log(err);
//     } else {
//       console.log("Created");
//       console.log(campground);
//     }
//   }
// )


var PORT = process.env.PORT || 3000
app.listen(PORT, process.env.IP, function() {
  console.log("Yelpcamp Server has started. The port is: " + PORT);
});
