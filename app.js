const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utility/WrapAsync");
const ExpressError = require("./utility/ExpressError");
const {listingSchema}=require("./schema.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// app.use((req,res,next)=>{
//     console.log(req.method,req.hostname,req.path);
//     next();
// })

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

//database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/property";
main()
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

//index route
app.get(
  "/",
  wrapAsync(async (req, res) => {
    const alllistings = await Listing.find();
    res.render("./listings/index.ejs", { listings: alllistings });
  })
);

//index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const alllistings = await Listing.find();
    res.render("./listings/index.ejs", { listings: alllistings });
  })
);

//new route
app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

//show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    res.render("./listings/show.ejs", { listing });
  })
);

//create route
app.post(
  "/listings",validateListing,
  wrapAsync(async (req, res, next) => {
    let listing = new Listing(...[req.body.listing]);
    await listing.save({ runValidators: true });
    res.redirect("/listings");
  })
);

//edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
  })
);

//update route
app.patch(
  "/listings/:id",validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body || !req.body.listing) {
      throw new ExpressError(400, "Enter valid data");
    }
    let { id } = req.params;
    let listing = req.body.listing;
    await Listing.findByIdAndUpdate(id, listing, { runValidators: true });
    res.redirect(`/listings/${id}`);
  })
);

//delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndDelete(id);
    if (!listing) {
      throw new ExpressError(410, "Listing not found!");
    }
    res.redirect(`/listings`);
  })
);

//error handling
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("./includes/error.ejs",{message}); 
});


//testing route
// app.get("/test", async (req,res)=>{
//     let listing1=new Listing({
//         title:"My house",
//         description:"luxury house between nature",
//         price:10000,
//         location:"Noida,Delhi",
//         country:"India"
//     });
//     await listing1.save();
//     res.send("listing successful");
// })

//server starting
app.listen(8080, () => {
  console.log("server started");
});
