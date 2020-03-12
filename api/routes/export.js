const fs = require("fs");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { createObjectCsvWriter: createCsvWriter } = require("csv-writer");
const Details = require("../models/details");
const log = require("console-debug-log");

const csvwriter = createCsvWriter({
  path: "results.csv",
  header: [
    { id: "name", title: "Name" },
    { id: "email", title: "Email" },
    { id: "abstract", title: "Abstract" }
  ]
});
router.get("/", (req, res) => {
  Details.find()
    .select("name email abstract _id")
    .exec()
    .then(async docs => {
      const response = {
        count: docs.length,
        details: docs.map(doc => {
          return {
            name: doc.name,
            email: doc.email,
            abstract: doc.abstract,
            _id: doc._id
          };
        })
      };
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
