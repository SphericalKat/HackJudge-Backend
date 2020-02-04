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

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
/*
//handling CORS errors
app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Content-Type, Accept, Authorization'
);
if (req.method === 'OPTIONS'){
  res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
  return res.status(200).json({});
}
next();
});
*/

app.use("/details", detailsRoutes);

/*app.use((req,res,next)=>{
  res.status(200).json({
    message: "it works"
  });
});

*/

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
