const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utility/WrapAsync");
const listingsRouter=require("./routes/listing");
const reviewsRouter=require("./routes/review");
const ExpressError=require("./utility/ExpressError");
const session=require("express-session");
const flash=require("express-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user");
const userRouter=require("./routes/user");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const sessionOptions={
   secret:"mysupersecretkey",
   resave:false,
   saveUninitialized:true,
   cookie:{
      expries:Date.now()+3*24*60*60*1000,
      maxAge:3*24*60*60*1000,
      httpOnly:true
   }
}


// app.use((req,res,next)=>{
//     console.log(req.method,req.hostname,req.path);
//     next();
// })

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



//session creation and flash messages
app.use(session(sessionOptions));
app.use(flash());

//passport authentication 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

// demo User authentication
// app.get("/demouser",async (req,res)=>{
//   let fakeUser=new User({
//      email:"student@gmail.com",
//      username:"delta-student"
//   });
//  let registeredUser=await User.register(fakeUser,"helloworld");
//  res.send(registeredUser);
// })

// home index route
app.get(
  "/",
  wrapAsync(async (req, res) => {
    const alllistings = await Listing.find();
    res.render("./listings/index.ejs", { listings: alllistings });
  })
);

//routing of listings and reviews
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

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
