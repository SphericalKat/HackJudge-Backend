const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const detailsRoutes = require("./api/routes/details");

mongoose.connect(
  "mongodb+srv://Pragati:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0-imrhf.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

//mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use("/details", detailsRoutes);


module.exports = app;
