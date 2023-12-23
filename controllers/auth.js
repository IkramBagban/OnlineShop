const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  const isLoggedIn =
    req.get("Cookie").split(";")[0].trim().split("=")[1] === "true";
  console.log(req.session);
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

// Storing data in a session
exports.postLogin = (req, res, next) => {
  User.findById("65806c272c1279a21240f881")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
