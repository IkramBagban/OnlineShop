const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post(
    "/signup",
    [
      check("email")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .custom((val, { req }) => {
          if (val === "abc@gmail.com") {
            throw new Error("This email address is forbidden.");
          }
          return true; // Don't forget to return true if the email is valid
        }),
  
      body("password")
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters long and alphanumeric.")
        .isAlphanumeric(),
    ],
    authController.postSignup
  );

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
