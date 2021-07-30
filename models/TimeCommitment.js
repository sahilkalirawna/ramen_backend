const mongoose = require("mongoose");

const timeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const timeModal = mongoose.model("times", timeSchema);

module.exports = timeModal;
