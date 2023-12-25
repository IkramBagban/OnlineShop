const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage : req.flash('error')
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email or password.')
        return res.redirect("/login");
      }

      // comparing user entered password with present user encrypted password using compare method of bcrypt.
      bcrypt
        .compare(password, user.password)
        // after entered password is correct. is matched will return true else false.
        .then((isMatched) => {

          // if password matched successfully. then set session variable and redirect.
          if (isMatched) {
            // Setting session variables for authentication
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }

          //if password don't match redirect to login page.
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/login");
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((user) => {
      // if new email is already exist in db. mean the user is already exist. so do nothing.
      if (user) return res.redirect("/signup");

      // encrypt the password. before saving into db. 
      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const u = new User({
          email: email,
          password: hashedPassword, // hashed password
          cart: { items: [] },
        });
        u.save();
      });
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
