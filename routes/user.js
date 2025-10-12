const express = require("express");
const router = express.Router();
const wrapAsync = require("../utility/WrapAsync");
const User = require("../models/user");
const passport = require("passport");
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      let newUser = {
        username: username,
        email: email,
      };
      const registeredUser= await User.register(newUser, password);
      req.login(registeredUser,(err)=>{
         if(err)
         {
           return next(err);
         }
         req.flash("success", "user registered successfully");
         res.redirect("/listings");
      })
    } catch (e) {
      req.flash("error",e.message);
      res.redirect("/signup");
    }
  })
);
router.get("/login",(req,res)=>{
  res.render("users/login.ejs");
})
router.post("/login",passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),wrapAsync(async(req,res)=>{
  let {username}=req.body;
  req.flash("success",`Welcome! ${username}`);
  res.redirect("/listings");
}));

router.get("/logout",wrapAsync(async(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","logged out successfully!");
    res.redirect("/");
  });
}))

module.exports = router;
