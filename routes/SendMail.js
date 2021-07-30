const express = require("express");

const router = express.Router();
const SendController = require("../controllers/SendMail");
const IsAuth = require("../middleware/is-auth");

router.post("/sendMail/:sendId", IsAuth, SendController.sendMail);
router.post("/cofounder/:id", SendController.cofounderActive);

module.exports = router;
