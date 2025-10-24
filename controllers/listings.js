const Listing=require("../models/listing");

module.exports.index=async (req, res) => {
    const alllistings = await Listing.find();
    if(!alllistings)
    {
       req.flash("error","No listing found");
       return res.redirect("/listings");
    }
    res.render("./listings/index.ejs", { listings: alllistings });
  };

module.exports.renderNewForm=(req, res) => {
  res.render("./listings/new.ejs");
}



module.exports.renderShow=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate({path:"reviews",populate:{
        path:"author"
      }})
      .populate("owner");
    if (!listing) {
      // throw new ExpressError(404, "Listing not found");
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    res.render("./listings/show.ejs", { listing });
  }

module.exports.renderCreateForm=async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image={url,filename};
    await listing.save({ runValidators: true });
    req.flash("success", "Listing added successfully");
    res.redirect("/listings");
  }

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      res.redirect("/listings");
    }
    let originalImageURL=listing.image.url;
    originalImageURL=originalImageURL.replace("/upload","/upload/w_250");
    res.render("./listings/edit.ejs", { listing,originalImageURL });
  }

module.exports.renderUpdate=async (req, res) => {
    if (!req.body || !req.body.listing) {
      throw new ExpressError(400, "Enter valid data");
    }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, { runValidators: true });
    if(typeof req.file !== "undefined")
    {
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save({ runValidators: true });
    }
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
  }

module.exports.renderDelete=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    if (!listing) {
      // throw new ExpressError(410, "Listing not found!");
      req.flash("error", "Listing not found");
      res.redirect("/listings");
    }
    req.flash("success", "Listing deleted successfully");
    res.redirect(`/listings`);
  }