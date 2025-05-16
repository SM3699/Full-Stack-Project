const User = require("../models/user.js");

module.exports.signupForm = (req, res) => {
    res.render("./users/signUp.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password} = req.body;
        const newUser = new User({ email, username});
        let registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("Success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req, res) => {
    res.render("./users/login.ejs");
};

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome Back To Wanderlust!");
    
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.loggedOut = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged Out!");
        res.redirect("/listings");
    });
};