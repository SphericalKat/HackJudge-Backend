const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const log = require("console-debug-log");
const V_R = require("../models/view_review");

router.get("/", (req, res) => {
  console.log(req.headers.host);
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
  V_R.find()
    .select("abstract link analysis review addComments metrics")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        details: docs.map(doc => {
          return {
            link: doc.link,
            analysis: doc.analysis,
            review: doc.review,
            addComments: doc.addComments,
            metrics: doc.metrics,
            abstract: doc.abstract,
            _id: doc._id
          };
        })
      };
      if (docs) {
        res.status(200).json(docs);
      } else {
        res.status(404).json({
          message: "no entries found"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:vrId", (req, res) => {
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
  const id = req.params.vrId;
  V_R.findById(id)
    .select("abstract link analysis review addComments metrics")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No valid id" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
