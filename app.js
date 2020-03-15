const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const detailsRoutes = require("./api/routes/details");
const adminRoutes = require("./api/routes/admin");
const exportRoutes = require("./api/routes/export");
const eventsRoutes = require("./api/routes/events");
const viewReviewRoutes = require("./api/routes/view_review");
const evaluateRoutes = require("./api/routes/evaluate");
//const calculateRoutes = require("./api/routes/calculate");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection
  .once("open", () => {
    console.log("Connection to mongoDB established");
  })
  .on("error", err => {
    console.log("Error connecting to mongoDB:", err);
  });

//mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use("/details", detailsRoutes);
app.use("/admin", adminRoutes);
app.use("/export", exportRoutes);
app.use("/events", eventsRoutes);
app.use("/evaluate", evaluateRoutes);
app.use("/viewReview", viewReviewRoutes);
// app.use("/calculate", calculateRoutes);

module.exports = app;
