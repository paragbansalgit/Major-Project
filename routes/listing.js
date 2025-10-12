const express=require("express");
const router=express.Router();
const wrapAsync = require("../utility/WrapAsync");
const ExpressError = require("../utility/ExpressError");
const Listing = require("../models/listing");
const {listingSchema}=require("../schema");
const {isLoggedIn}=require("../middleware");

//validate listing
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error)
    {
        const errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//index route
router.get(
  "/",isLoggedIn,
  wrapAsync(async (req, res) => {
    const alllistings = await Listing.find();
    res.render("./listings/index.ejs", { listings: alllistings });
  })
);

//new route
router.get("/new",isLoggedIn, (req, res) => {
  res.render("./listings/new.ejs");
});

//show route
router.get(
  "/:id",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      // throw new ExpressError(404, "Listing not found");
      req.flash("error","Listing not found");
      return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing});
  })
);

//create route
router.post(
  "/",isLoggedIn,
  (req, res, next) => {
    // Convert price to number before validation
    if (req.body.listing && typeof req.body.listing.price === "string") {
      req.body.listing.price = Number(req.body.listing.price);
    }
    next();
  },
  validateListing,
  wrapAsync(async (req, res) => {
    const listing = new Listing(req.body.listing);
    await listing.save({ runValidators: true });
    req.flash("success","Listing added successfully");
    res.redirect("/listings");
  })
);


//edit route
router.get(
  "/:id/edit",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing)
    {
      req.flash("error","Listing not found");
      res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
  })
);

//update route
router.patch(
  "/:id",isLoggedIn,
  (req, res, next) => {
    // Convert price to number before validation
    if (req.body.listing && typeof req.body.listing.price === "string") {
      req.body.listing.price = Number(req.body.listing.price);
    }
    next();
  },
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body || !req.body.listing) {
      throw new ExpressError(400, "Enter valid data");
    }
    let { id } = req.params;
    let listing = req.body.listing;
    await Listing.findByIdAndUpdate(id, listing, { runValidators: true });
    req.flash("success","Listing updated successfully");
    res.redirect(`/listings/${id}`);
  })
);

//delete route
router.delete(
  "/:id",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndDelete(id);
    if (!listing) {
      // throw new ExpressError(410, "Listing not found!");
      req.flash("error","Listing not found");
      res.redirect("/listings");
    }
    req.flash("success","Listing deleted successfully");
    res.redirect(`/listings`);
  })
);

module.exports=router;