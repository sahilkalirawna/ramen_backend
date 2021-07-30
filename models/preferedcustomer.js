const mongoose = require("mongoose");

const preferedSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const preferedModal = mongoose.model("prefereds", preferedSchema);

module.exports = preferedModal;
