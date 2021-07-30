const express = require("express");
const { body } = require("express-validator");

const Profile = require("../models/Profile");
const authController = require("../controllers/Auth");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

//User SignUp
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter A Valid Email")
      .custom((value, { req }) => {
        return Profile.findOne({ email: value }).then((profileDoc) => {
          if (profileDoc) {
            return Promise.reject("Email Already Exists");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  authController.signup
);

//User Login
router.post("/login", authController.login);

//User Logout
router.get("/logout", authController.logout);

//Forgot Password & Reset Password
router.post("/forgetPassword", authController.forget);
router.put("/resetPassword", authController.resetPassword);

router.put("/update/:id", authController.updateProfile);

module.exports = router;
