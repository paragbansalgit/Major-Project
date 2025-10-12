const express=require("express");
const router=express.Router({mergeParams:true});
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const wrapAsync = require("../utility/WrapAsync");
const ExpressError = require("../utility/ExpressError");
const Listing = require("../models/listing");

//validate review
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error)
    {
        const errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//add a review form
router.post("/",validateReview,
  wrapAsync(async(req,res)=>{
   let {id}=req.params;
   let review=req.body.review;
  let newReview= await Review.insertOne(review);
  let listing=await Listing.findById(id);
  listing.reviews.push(newReview);
  await listing.save({runValidators:true});
  req.flash("success","Review added successfully");
  res.redirect(`/listings/${id}`);
}));

//delete route reviews
router.delete("/:reviewId",wrapAsync(async (req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review deleted successfully");
  res.redirect(`/listings/${id}`);
}))

module.exports=router;