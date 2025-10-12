module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.flash("error","Login to access");
        return res.redirect("/login");
    }
    next();
}