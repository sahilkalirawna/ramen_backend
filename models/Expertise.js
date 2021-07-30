const mongoose = require("mongoose");

const expertiseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const expertiseModal = mongoose.model("expertises", expertiseSchema);

module.exports = expertiseModal;
