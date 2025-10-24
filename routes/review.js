const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utility/WrapAsync");
const {isValidReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");

//add a review form
router.post("/",isLoggedIn, isValidReview,
  wrapAsync(reviewController.renderReviewForm));

//delete route reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.renderDelete))

module.exports=router;