const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Details = require("../models/details");

router.get("/", (req, res) => {
  console.log(req.headers.host);
  Details.find()
    .select("name email abstract _id")
    .exec()
    .then(docs => {
      //console.log(docs);
      //if (docs.length > 0){
      const response = {
        count: docs.length,
        details: docs.map(doc => {
          //object spread operator?
          return {
            name: doc.name,
            email: doc.email,
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

router.post("/", (req, res) => {
  console.log(req.body);
  const details = new Details({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    abstract: req.body.abstract
  });
  details.save().then(result => {
    console.log(result);
    res.status(201).send({
      message: "Create details successfully",
      createdProduct: {
        name: result.name,
        email: result.email,
        abstract: result.abstract,
        _id: result._id
      }
    });
  });
});

router.get("/:detailsId", (req, res, next) => {
  const id = req.params.detailsId;
  Details.findById(id)
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

router.patch("/:detailsId", (req, res, next) => {
  const id = req.params.detailsId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Details.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:detailsId", (req, res, next) => {
  const id = req.params.detailsId;
  Details.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        result: "Document deleted successfully"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
