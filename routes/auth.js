const express = require("express");
const { check, body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter Valid Email")
      .custom((val, req) => {
        console.log(val);
        return User.findOne({ email: val }).then((user) => {
          if (!user) {
            return Promise.reject("Email Doesn't Exist.");
          }
        });
      }),

      body('password', 'Invalid Password!').isLength({min : 5})
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((val, { req }) => {
        return User.findOne({ email: val }).then((user) => {
          if (user) {
            return Promise.reject("Email already exist.");
          }
        });
      }),

    body("password")
      .isLength({ min: 5 })
      .withMessage(
        "Password must be at least 5 characters long and alphanumeric."
      )
      .isAlphanumeric(),
    body("confirmPassword").custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Passwd do not match.");
      }

      return true;
    }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
