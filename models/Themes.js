const mongoose = require("mongoose");

const themesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const themesModal = mongoose.model("themes", themesSchema);

module.exports = themesModal;
