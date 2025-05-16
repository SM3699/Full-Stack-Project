const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

router
    .route("/signup")
    .get(userController.signupForm)
    .post(wrapAsync(userController.signup));

// router.get("/signup", userController.signupForm);
// router.post("/signup", wrapAsync(userController.signup));

//login
router
    .route("/login")
    .get(userController.loginForm)
    .post(saveRedirectUrl, 
        passport.authenticate("local", {failureRedirect : "/login", failureFlash : true }), 
        userController.login);

// router.get("/login", userController.loginForm);

// router.post("/login", saveRedirectUrl, 
//     passport.authenticate("local", {failureRedirect : "/login", failureFlash : true }), 
//     userController.login);

//LOGGGED OUT 
router.get("/logout", userController.loggedOut);


module.exports = router;