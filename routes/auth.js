const { Router } = require("express");
const { body } = require("express-validator");

const Profile = require("../models/Profile");
const authController = require("../controllers/Auth");
const isAuth = require("../middleware/is-auth");

module.exports = Router()
//User SignUp
.post(
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
)

//User Login
.post("/login", authController.login)

//User Logout
.get("/logout", authController.logout)

//Forgot Password & Reset Password
.post("/forgetPassword", authController.forget)
.put("/resetPassword", authController.resetPassword)

.put("/update/:id", authController.updateProfile)


