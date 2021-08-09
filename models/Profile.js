const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
  Types: { ObjectId },
} = mongoose.Schema;

const profileSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userimg: {
    type: String,
  },
  background: {
    type: String,
  },
  ideatostart: {
    type: String,
  },
  Address: {
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  Themes: [{ type: ObjectId, ref: "themes" }],
  Skills: [{ type: ObjectId, ref: "skills" }],
  Expertise: [{ type: ObjectId, ref: "expertises" }],
  lookingforfounder: {
    type: Boolean,
    default: false,
  },
  cofounder: { type: ObjectId, ref: "cofounders" },
});

const ProfileModel = mongoose.model("Profile", profileSchema);

module.exports = ProfileModel;
