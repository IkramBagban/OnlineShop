const crypto = require('crypto')
const bcrypt = require("bcrypt");
const User = require("../models/user");
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
  auth :{
    api_key : process.env.SENDGRID_API_KEY
  }
}))

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
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
          req.flash("error", "Invalid email or password.");
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
      if (user) {
        req.flash("error", "Email already exist.");
        return res.redirect("/signup");
      }

      if(password.toString() !== confirmPassword.toString()){
          req.flash("error", "Password Do not match.");
          return res.redirect("/signup");
      }

      // encrypt the password. before saving into db.
      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const u = new User({
          email: email,
          password: hashedPassword, // hashed password
          cart: { items: [] },
        });
        return u.save();
        
      }).then(result =>{
        res.redirect("/login");
        return transporter.sendMail({
          to : email,
          from : 'bagbanikram@gmail.com',
          subject : 'Signup succeeded',
          html : '<h1>You successfully signed up!</h1>'
        })
      }).catch(err => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req,res,next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
}

exports.postReset = (req,res,next) => {
  crypto.randomBytes(32, (err, buffer) =>{
    if(err){
      console.log(err)
      return res.redirect('/reset');
    }
    const token = buffer.toString();

    User.findOne({email : req.body.email}).then(user =>{
      if(!user){
        req.flash('error', 'No Account With That Email Found.')
        return res.redirect('/reset');
      }

      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save();
    }).then(result =>{
      transporter.sendMail({
        to : req.body.email,
        from : 'bagbanikram@gmail.com',
        subject : 'Password Reset',
        html : `
        <p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:2000/reset/${token}">link</a> to reset your account.</p>
        `

      })
      res.redirect('/')
    }).catch(err => console.log(err))
  })
}