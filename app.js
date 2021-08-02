const express = require("express");

// cors import
const cors = require("cors");

// to set data type

// for mongodb
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const profileDone = require("./routes/profileRoute");
const sendMail = require("./routes/SendMail");

// for location path
const path = require("path");

// for image
const multer = require("multer");

// for data changes
const _ = require("lodash");

// For url logs
const morgan = require("morgan");

// config variables
const config = require("./config/config.json");
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || "development";

const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

// global config
global.gConfig = finalConfig;

const app = express();

app.use(cors());
app.use(bodyParser.json());
// logger
app.use(morgan("dev"));

//Routes
app.use("/auth", authRoutes);
app.use(profileDone);
app.use(sendMail);

// mongoose db connection
mongoose
  .connect(global.gConfig.URI, { useNewUrlParser: true })
  .then(() => {
    console.info(
      `DB connected Successfully on ======> ${global.gConfig.node_port}, ${global.gConfig.URI}`
    );
  })
  .catch(() => {
    console.error("DB connection failed ======>");
  });

// global error control
app.use((error, req, res, next) => {
  console.log("global", error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data[0].msg;
  res.status(status).json({ message });
});

app.listen(global.gConfig.node_port);
