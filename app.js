var express        = require("express"),
    app            = express(),
    methodOverride = require("method-override"),
    LocalStrategy  = require("passport-local"),
    flash          = require("connect-flash"),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    User           = require("./models/user"),
    seedDB         = require("./seeds");

// requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Love and Thunder",
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

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function() {
    console.log("The Yelp Camp server has started...")
});