const mongoose = require("mongoose");

const expertiseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const expertiseModal = mongoose.model("skills", expertiseSchema);

module.exports = expertiseModal;
