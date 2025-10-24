const express = require("express");
const router = express.Router();
const wrapAsync = require("../utility/WrapAsync");
const User = require("../models/user");
const passport = require("passport");
const {redirectUrl}=require("../middleware");
const userController=require("../controllers/users");


router.route("/signup")
.get(userController.renderSignUpForm)
.post(
  wrapAsync(userController.postSignUpData)
);

router.route("/login")
.get(userController.renderLogInForm)
.post(
  redirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.postLogInData)
);

router.get(
  "/logout",
  wrapAsync(userController.renderLogOutForm)
);

module.exports = router;
