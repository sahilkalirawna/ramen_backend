const { Router } = require("express");
const SendController = require("../controllers/SendMail");
const IsAuth = require("../middleware/is-auth");

module.exports = Router()
.post(
  "/sendMail/:sendId",
  IsAuth,
  SendController.sendMail
)
.post("/cofounder/:id", SendController.cofounderActive);
