const Listing=require("./models/listing");
const ExpressError=require("./utility/ExpressError");
const {listingSchema,reviewSchema}=require("./schema");
const Review = require("./models/review");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Login to access");
        return res.redirect("/login");
    }
    next();
}

module.exports.redirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.originalUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let findlisting=await Listing.findById(id);
    if(!findlisting.owner._id.equals(res.locals.currUser._id))
    {
         req.flash("error","Only owner can make updates!");
         return  res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isValidateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error)
    {
        const errMsg=error.details.map((el)=>el.message).join(",");
        // throw new ExpressError(400,errMsg);
        req.flash("error",`${errMsg}`);
       return res.redirect(`${req.originalUrl}`);
    }else{
        next();
    }
}

module.exports.isValidReview= this.redirectUrl,(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
        if(error)
        {
            const errMsg=error.details.map((el)=>el.message).join(",");
            req.flash("error",errMsg);
            return res.redirect(res.locals.originalUrl);
        }else{
            next();
        }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let { id,reviewId } = req.params;
    let findReview=await Review.findById(reviewId);
    if( !findReview.author.equals(res.locals.currUser._id))
    {
         req.flash("error","Only author can delete!");
         return  res.redirect(`/listings/${id}`);
    }
    next();
}
