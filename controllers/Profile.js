const Profile = require("../models/Profile");
const Themes = require("../models/Themes");
const Skills = require("../models/Skills");
const Expertise = require("../models/Expertise");
const Cofounder = require("../models/Cofounder");

//Sending static data of Qualities like themes, skills and expertise
exports.getQualitiesdata = async (req, res, next) => {
  let category = [];
  const themes = await Themes.find();
  const skills = await Skills.find();
  const expertise = await Expertise.find();

  //   const pro = await Profile.findById("6100dccde5fe5b400480d12d").select(
  //     "Themes"
  //   );
  //   pro.Themes.map(async (d) => {
  //     console.log(d);
  //     const f = await Themes.findById(d);
  //     console.log(f);
  //   });
  //   console.log(pro);
  category = [
    { default: "Lookin for cofounder", id: 0 },
    { themes },
    { skills },
    { expertise },
  ];

  res.send(category);
};

//Get all user data
exports.getAllData = async (req, res, next) => {
  console.log(req.userId);
  const nikhil = await Cofounder.findById("610380fe3070bc1fa8062f89").populate(
    "userId"
  );

  console.log("My data", nikhil);
  const data = await Profile.find();
  console.log(data);
  const final = data.filter((d) => d._id != req.userId);
  res.status(200).json({ final });
};

//Get single User data
exports.getUser = async (req, res, next) => {
  const id = req.params.id;
  const data = await Profile.findById(id);
  res.status(200).json({ data });
};

//Searching and Filtering
exports.getSearch = async (req, res, next) => {
  const { search, Theme, Skill, Expert } = req.body;
  console.log(Theme.length);
  const regex = new RegExp(search, "i");
  const dataFilter = await Profile.find({
    name: regex,
    $and: [{ Themes: { $all: Theme } }, { Skills: { $all: Skill } }],
  });
  res.status(200).json({ dataFilter });
};

//Pagination
exports.userPaginate = async (req, res, next) => {
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
  console.log(limit);
  console.log(skip);
  const data = await Profile.find({}).skip(skip).limit(limit);
  res.status(200).json({ data });
};
