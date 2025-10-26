const express = require("express");
const router = express.Router();
const wrapAsync = require("../utility/WrapAsync");
const { isLoggedIn, isOwner, isValidateListing } = require("../middleware");
const listingController=require("../controllers/listings");
const multer=require("multer");
const {storage}=require("../cloudConfig");
const upload=multer({storage});

router.route("/")
.get(
  wrapAsync(listingController.index)
)
.post(
  isLoggedIn,
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