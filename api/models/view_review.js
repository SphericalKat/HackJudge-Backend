const mongoose = require("mongoose");

const viewReviewSchema = mongoose.Schema({
  qualifiedTeams: { type: Number, required: true },
  evaluatedTeams: { type: Number, required: true }
});

module.exports = mongoose.model("V_R", viewReviewSchema);
