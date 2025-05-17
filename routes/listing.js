const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require('../models/listing.js');
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


//Index & Create Route


router
    .route("/")
    .get(listingController.home)
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));



// Index Route..
// router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm );

// Create Route
// router.post("/",  validateListing, wrapAsync(listingController.createListing));

// Show, Update & Delete Route
// router
//     .route("/:id")
//     .get( wrapAsync(listingController.showListing))
//     .put( isLoggedIn, isOwner, wrapAsync(listingController.updateListing))
//     .delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Show Route
router.get("/:id", wrapAsync(listingController.showListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Update Route
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing,  wrapAsync(listingController.updateListing));

//Delete Route 
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;