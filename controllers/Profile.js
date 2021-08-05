const {
  Types: { ObjectId },
} = require("mongoose");
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
  // let category = [];
  const themes = await Themes.find();
  const skills = await Skills.find();
  const expertise = await Expertise.find();
  const timecommit = await TimeCommit.find();
  const preference = await Preference.find();
  const copreference = await CoPreference.find();
  const lookingForFounder = { name: "Lookin for cofounder", id: 0 };
  // category = [
  //   { default: "Lookin for cofounder", id: 0 },
  //   { themes },
  //   { skills },
  //   { expertise },
  //   { timecommit },
  //   { preference },
  //   { copreference },
  // ];
  res.status(200).json({
    lookingForFounder,
    themes,
    skills,
    expertise,
    timecommit,
    preference,
    copreference,
  });
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
    res.status(200).json({ message: "Profiles List", success: true, result });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//Get single User data
exports.getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (id.length < 24) {
      const error = new Error("Invalid User or User not Found");
      console.log(error);
      error.statusCode = 404;
      throw error;
    }

    const result = await Profile.findById(id)
      .populate("Themes", "name")
      .populate("Skills", "name")
      .populate("Expertise", "name");
    if (!result) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res
      .status(200)
      .json({ message: "Single User Found", success: true, result });
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//Searching ,Filtering, Pagination and listofalluser
exports.getSearchProfile = async (req, res, next) => {
  const {
    search,
    Theme,
    Skill,
    Expert,
    cofounderTimecomit,
    cofounderPreference,
    cofounderCopreference,
  } = req.body;
  const { p: page = 1, l: limit = 5 } = req.query;

  try {
    let query = {};
    if (search) query.name = new RegExp(search, "i");
    if (Theme) query.Themes = { $in: Theme.map((e) => ObjectId(e)) };
    if (Skill) query.Skills = { $in: Skill.map((e) => ObjectId(e)) };
    if (Expert) query.Expertise = { $in: Expert.map((e) => ObjectId(e)) };
    if (cofounderTimecomit)
      query["cofounderData.Timecommit"] = {
        $in: cofounderTimecomit.map((e) => ObjectId(e)),
      };
    if (cofounderPreference)
      query["cofounderData.preference"] = {
        $in: cofounderPreference.map((e) => ObjectId(e)),
      };
    if (cofounderCopreference)
      query["cofounderData.preferedcustomer"] = {
        $in: cofounderCopreference.map((e) => ObjectId(e)),
      };

    console.log(query);

    let aggregatePipeline = [
      {
        $lookup: {
          from: "cofounders",
          localField: "_id",
          foreignField: "userId",
          as: "cofounderData",
        },
      },
      {
        $unwind: {
          path: "$cofounderData",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    if (Object.keys(query).length) {
      aggregatePipeline.push({ $match: query });
    }
    console.log(aggregatePipeline);

    const result = await Profile.aggregate(aggregatePipeline);

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

exports.aggregateProfile = async (req, res, next) => {
  console.log("Working...");
  Profile.aggregate().exec((err, results) => {
    if (err) {
      res.send(err);
    }
    if (results) {
      res.send({
        data: results,
      });
    }
  });
};
