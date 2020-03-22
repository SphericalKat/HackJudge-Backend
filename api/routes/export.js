const fs = require("fs");
const express = require("express");
const router = express.Router();
const { createObjectCsvWriter: createCsvWriter } = require("csv-writer");
const Details = require("../models/details");

const csvwriter = createCsvWriter({
  path: "results.csv",
  header: [
    { id: "name", title: "Name" },
    { id: "email", title: "Email" },
    { id: "abstract", title: "Abstract" }
  ]
});
router.get("/", (req, res) => {
  const token = req.header("Authorization");
  let email;
  try {
    email = jwt.verify(token, process.env.JWT_PASS);
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      message: err
    });
  }
  Details.find()
    .select("name email abstract _id")
    .exec()
    .then(async docs => {
      if (docs) {
        try {
          await csvwriter.writeRecords(docs);
          fs.readFile("results.csv", (err, data) => {
            if (err) {
              console.log(err);
              res.status(500).json({
                error: err
              });
            } else {
              res.writeHead(200, {
                "Content-Type": "text/csv",
                "Content-Disposition": "attachment;filename=result.csv",
                "Content-Length": data.length
              });
              res.write(data, "binary");
              res.end();
            }
          });
        } catch (err) {
          console.log(err);
          res.status(500).json({
            error: err
          });
        }
        res.status(200);
      } else {
        res.status(404);
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
