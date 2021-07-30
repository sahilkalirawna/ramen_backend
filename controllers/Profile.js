const Profile = require("../models/Profile");
const Themes = require("../models/Themes");
const Skills = require("../models/Skills");
const Expertise = require("../models/Expertise");
const Cofounder = require("../models/Cofounder");
const TimeCommit = require("../models/TimeCommitment");
const Preference = require("../models/preference");
const CoPreference = require("../models/preferedcustomer");

//Sending static data of Qualities like themes, skills and expertise
exports.getQualitiesdata = async (req, res, next) => {
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
    const final = data.filter((d) => d._id != req.userId);
    res.status(200).json({ final });
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
    const data = await Profile.findById(id);
    if (!data) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ data });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//Searching and Filtering
exports.getSearch = async (req, res, next) => {
  const { search, Theme, Skill, Expert } = req.body;
  try {
    const regex = new RegExp(search, "i");
    const dataFilter = await Profile.find({
      name: regex,
      $or: [
        { Themes: { $in: Theme } },
        { Skills: { $in: Skill } },
        { Expertise: { $in: Expert } },
      ],
    });
    if (!dataFilter) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ dataFilter });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//Pagination
exports.userPaginate = async (req, res, next) => {
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
  try {
    const data = await Profile.find({}).skip(skip).limit(limit);
    if (!dataFilter) {
      const error = new Error("data is not available");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ data });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
