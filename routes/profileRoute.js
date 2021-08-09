const { Router } = require("express");
const profileControlller = require("../controllers/Profile");
// const isAuth = require("../middleware/is-auth");

module.exports = Router()
  .get("/sendQualitiesdata", profileControlller.sendQualitiesdata)
  .get("/getAlldata", profileControlller.getAllData)
  .get("/getUser/:id", profileControlller.getUser)
  .post("/getSearchProfile", profileControlller.getSearchProfile);
