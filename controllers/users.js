const User = require("../models/user");

module.exports.renderSignUpForm=(req, res) => {
  res.render("users/signup.ejs");
}

module.exports.postSignUpData=async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      let newUser = {
        username: username,
        email: email,
      };
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "user registered successfully");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }

module.exports.renderLogInForm=(req, res) => {
  res.render("users/login.ejs");
}

module.exports.postLogInData=async (req, res) => {
    let { username } = req.body;
    req.flash("success", `Welcome! ${username}`);
    const redirectUrl=res.locals.originalUrl || "/listings";
    res.redirect(redirectUrl);
  }

module.exports.renderLogOutForm=async (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "logged out successfully!");
      res.redirect("/");
    });
  }