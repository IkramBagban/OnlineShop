// Middleware to check if the user is authenticated
module.exports = (req, res, next) => {
  // If the user is not authenticated, redirect to the login page and return
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }

  // if user is authenticated. do nothing and call next middleware.
  next();
};
