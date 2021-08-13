const { validationResult } = require("express-validator");
const bcryptd = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../helper/index");
const Profile = require("../models/Profile");
const { token } = require("morgan");
const Cofounder = require("../models/Cofounder");
const dotenv = require("dotenv");
const _ = require("lodash");
dotenv.config();

// User Signup
exports.signup = async (req, res, next) => {
  //Validation Error
  try {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      let error = new Error("Validation Error");
      error.statusCode = 422;
      console.log("error", error);
      error.message = errors.array();
      throw error;
    }

    let data = req.body;
    const password = data.password;

    const hashedPw = await bcryptd.hash(password, 12);
    data.password = hashedPw;

    const result = await Profile(data).save();
    let cofound = {
      userId: result._id,
    };
    const done = await Cofounder(cofound).save();
    result.cofounder = done._id;
    await result.save();
    res.status(201).json({
      messgae: "New Profile Created !",
      success: true,
      userId: result._id,
    });
  } catch (error) {
    console.log("catch error", error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// User Login
exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  try {
    const user = await Profile.findOne({ email: email });

    if (!user) {
      const error = new Error("Email Not Found");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;

    const isEqual = await bcryptd.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Wrong Password !");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      "somesuperscript",
      { expiresIn: "1hr" }
    );

    res.status(200).json({
      token: token,
      userId: loadedUser._id.toString(),
      userName: loadedUser.name,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// User Logout
exports.logout = (req, res) => {
  const authHeader = req.get("Authorization");
  console.log(authHeader);
  // return res.status().json({message:"Delete"})
};

//Forget Password
exports.forget = async (req, res, next) => {
  const email = req.body.email;
  try {
    const user = await Profile.findOne({ email: email });
    if (!user) {
      res.status(400).json({ message: "User not Exists" });
    }
    const token = jwt.sign(
      { _id: user._id, iss: "NODEAPI" },
      "somesuperscript"
    );
    console.log("Hey your token", token);

    const emailData = {
      from: "Ramen@ramen.com",
      to: email,
      subject: "Password Reset Instructions",
      text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/resetPassword/${token}`,
      // html: `<p>Please use the following link to reset your password:</p> <a>${process.env.CLIENT_URL}/reset-password/${token}</a>`,
    };

    return user.updateOne(
      { resetPasswordLink: token },
      async (err, success) => {
        console.log(user);
        if (err) {
          return res.json({ message: err });
        } else {
          const data = await sendEmail(emailData);
          return res.status(200).json({
            data,
            message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
          });
        }
      }
    );
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { resetPasswordLink, newPassword } = req.body;

  Profile.findOne({ resetPasswordLink }, (err, user) => {
    // if err or no user
    if (err || !user) {
      return res.status("401").json({
        error: "Invalid Link!",
      });
    }
    const updatedFields = {
      password: newPassword,
      resetPasswordLink: "",
    };

    user = _.extend(user, updatedFields);
    user.updated = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
    });
    res.json({
      message: `Great! Now you can login with your new password.`,
    });
  });
};

//Edit or Update profile
exports.updateProfile = async (req, res, next) => {
  const userId = req.params.id;

  const userData = await Profile.findById(userId);
  const coFounderData = await Cofounder.findById(userData.cofounder);
  console.log(coFounderData);
  if (!userData) {
    const error = new Error("Could not find User !");
    error.statusCode = 403;
    throw error;
  }

  userData.name = req.body.name;
  userData.email = req.body.email;
  userData.userimg = req.body.userimg;
  userData.background = req.body.background;
  userData.ideatostart = req.body.ideatostart;
  userData.Address = {
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
  };
  userData.Themes = req.body.Themes;
  userData.Skills = req.body.Skills;
  userData.Expertise = req.body.Expertise;

  const result = await userData.save();

  res.status(200).json({
    message: "User's Profile Updated !",
    userData: result,
  });
};
