const mongoose = require("mongoose");

const preferenceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const preferenceModal = mongoose.model("preferences", preferenceSchema);

module.exports = preferenceModal;
