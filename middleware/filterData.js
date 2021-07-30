const ProfileModel = require("../models/Profile");

module.exports = async (req, res, next) => {
  const { Theme } = req.body;
  console.log(Theme);
  const data = await ProfileModel.find({ Themes: [Theme] });
  console.log(data);
  next();
};
