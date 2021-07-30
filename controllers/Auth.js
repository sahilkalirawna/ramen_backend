const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../helper/index");
const Profile = require("../models/Profile");
const { token } = require("morgan");
const Cofounder = require("../models/Cofounder");

// User Signup
exports.signup = async (req, res, next) => {
  //Validation Error
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    let error = new Error("Validation Error");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  let data = req.body;
  const password = data.password;
  try {
    const hashedPw = await bcrypt.hash(password, 12);
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
      userId: result._id,
      data: done,
    });
  } catch (error) {
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

    const isEqual = await bcrypt.compare(password, user.password);

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
exports.forget = async (req, res) => {
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
      text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <a>${process.env.CLIENT_URL}/reset-password/${token}</a>`,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      console.log(user);
      if (err) {
        return res.json({ message: err });
      } else {
        sendEmail(emailData);
        return res.status(200).json({
          message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
        });
      }
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { resetPasswordLink } = req.body;

  Profile.findOne({ resetPasswordLink }, (err, user) => {
    // if err or no user
    if (err || !user) {
      return res.status("401").json({
        error: "Invalid Link!",
      });
    } else {
      return res.status("201").json({
        user,
      });
    }
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
  userData.password = req.body.password;
  userData.userimg = req.body.userimg;
  userData.background = req.body.background;
  userData.ideatostart = req.body.ideatostart;
  userData.Address = {
    city: req.body.Address.city,
    state: req.body.Address.state,
    country: req.body.Address.country,
  };
  userData.Themes = req.body.Themes;
  userData.Skills = req.body.Skills;
  userData.Expertise = req.body.Expertise;

  const result = await userData.save();

  coFounderData.Timecommit = req.body.cofounder.Timecommit;
  const done = await coFounderData.save();

  res.status(200).json({
    message: "User's Profile Updated !",
    userData: result,
    cofounder: done,
  });
};
