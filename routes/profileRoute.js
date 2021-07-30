const express = require("express");
const router = express.Router();
const profileControlller = require("../controllers/Profile");
const filterdata = require("../middleware/filterData");
const isAuth = require("../middleware/is-auth");

router.get("/getQualitiesdata", profileControlller.getQualitiesdata);
router.get("/getAlldata", profileControlller.getAllData);
router.get("/getUser/:id", profileControlller.getUser);
router.get("/search", profileControlller.getSearch);
router.get("/paginate", profileControlller.userPaginate);
module.exports = router;
