const mongoose = require("mongoose");
const detailsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true },
  abstract: { type: String, required: true },
  link: {type: String, require: true}
});

module.exports = mongoose.model("Details", detailsSchema);
