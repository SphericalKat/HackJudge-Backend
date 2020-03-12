const mongoose = require("mongoose");
const metricSchema = mongoose.Schema({
  metricName: { type: String, required: true },
  maxScore: { type: Number, required: true }
});
const eventsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  metric: { type: [metricSchema], required: true },
  rounds: { type: Number, required: true },
  problemStatements: { type: [String], required: true }
});

module.exports = mongoose.model("Events", eventsSchema);

