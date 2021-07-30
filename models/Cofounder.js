const mongoose = require("mongoose");

const cofounderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  Timecommit: [{ type: mongoose.Schema.Types.ObjectId, ref: "times" }],
  preference: [{ type: mongoose.Schema.Types.ObjectId, ref: "preferences" }],
  preferedcustomer: [
    { type: mongoose.Schema.Types.ObjectId, ref: "prefereds" },
  ],
});

const cofounderModal = mongoose.model("cofounders", cofounderSchema);

module.exports = cofounderModal;
