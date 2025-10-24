const express = require("express");
const router = express.Router();
const wrapAsync = require("../utility/WrapAsync");
// const ExpressError = require("../utility/ExpressError");
// const Listing = require("../models/listing");
const { isLoggedIn, isOwner, isValidateListing } = require("../middleware");
const listingController=require("../controllers/listings");
const multer=require("multer");
const {storage}=require("../cloudConfig");
const upload=multer({storage});

router.route("/")
.get(
  // isLoggedIn,
  wrapAsync(listingController.index)
)
.post(
  isLoggedIn,
  // (req, res, next) => {
  //   // Convert price to number before validation
  //   // if (req.body && typeof req.body.listing.price === "string") {
  //   //   req.body.listing.price = Number(req.body.listing.price);
  //   // }
  //   next();
  // },
  upload.single("listing[image]"),isValidateListing,
  wrapAsync(listingController.renderCreateForm)
);


//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

router.route("/:id")
.get(
  wrapAsync(listingController.renderShow)
)
.patch(
  isLoggedIn,
  isOwner,
  // (req, res, next) => {
  //   // Convert price to number before validation
  //   if (req.body.listing && typeof req.body.listing.price === "string") {
  //     req.body.listing.price = Number(req.body.listing.price);
  //   }
  //   next();
  // }
  upload.single("listing[image]"),
  isValidateListing,
  wrapAsync(listingController.renderUpdate)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderDelete)
);

module.exports = router;