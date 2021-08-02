const Profile = require("../models/Profile");
const Themes = require("../models/Themes");
const Skills = require("../models/Skills");
const Expertise = require("../models/Expertise");
const Cofounder = require("../models/Cofounder");
const TimeCommit = require("../models/TimeCommitment");
const Preference = require("../models/preference");
const CoPreference = require("../models/preferedcustomer");

//Sending static data of Qualities like themes, skills and expertise
exports.sendQualitiesdata = async (req, res, next) => {
  let category = [];
  const themes = await Themes.find();
  const skills = await Skills.find();
  const expertise = await Expertise.find();
  const timecommit = await TimeCommit.find();
  const preference = await Preference.find();
  const copereference = await CopeReference.find();
  category = [
    { default: "Lookin for cofounder", id: 0 },
    { themes },
    { skills },
    { expertise },
    { timecommit },
    { preference },
    { copereference },
  ];

  res.send(category);
};

//Get all user data
exports.getAllData = async (req, res, next) => {
  try {
    const data = await Profile.find();
    if (!data) {
      const error = new Error("User Profile Data list not found");
      error.statusCode = 404;
      throw error;
    }
    const result = data.filter((d) => d._id != req.userId);
    res.status(200).json({ message:"Profiles List",success:true,result });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//Get single User data
exports.getUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await Profile.findById(id);
    if (!result) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message:"Single User Found",success:true,result });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//Searching ,Filtering, Pagination and listofalluser
exports.getSearchProfile = async (req, res, next) => {

    const { search, Theme, Skill, Expert } = req.body;
    const { p: page= 1 , l: limit =5} = req.query; 
   
    try {
    let query = {};
    if (search) query.name = new RegExp(search, "i");
    if (Theme) query.Themes = { $in: Theme };
    if (Skill) query.Skills = { $in: Skill };
    if (Expert) query.Expertise = { $in: Expert };

    const result = await Profile.find(query).skip((parseInt(page) - 1) * limit).limit(parseInt(limit));

    if (result.length == 0) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "filtered data", success: true, result });

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

