const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const log = require("console-debug-log");
const jwt = require("jsonwebtoken");
const Details = require("../models/details");

router.get("/", (req, res) => {
  log.debug(req.headers.host);
  Details.find()
    .select("name email abstract _id link")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        details: docs.map(doc => {
          return {
            name: doc.name,
            email: doc.email,
            abstract: doc.abstract,
            _id: doc._id,
            link: doc.link
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
  log.debug(req.body);
  const details = new Details({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    abstract: req.body.abstract,
    link: req.body.link
  });
  details.save().then(result => {
    log.debug(result);
    res.status(201).send({
      message: "Create details successfully",
      createdProduct: {
        name: result.name,
        email: result.email,
        abstract: result.abstract,
        link: result.link,
        _id: result._id
      }
    });
  });
});

router.get("/:detailsId", (req, res) => {
  const id = req.params.detailsId;
  Details.findById(id)
    .select("name email abstract _id")
    .exec()
    .then(doc => {
      log.debug("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No valid id" });
      }
    })
    .catch(err => {
      log.debug(err);
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
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:8080/details/" + id
        }
      });
    })
    .catch(err => {
      log.debug(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:detailsId", async (req, res) => {
  const id = req.params.detailsId;
  let result;
  try {
    result = await Details.remove({ _id: id }).exec();
  } catch (err) {
    log.debug(err);
    res.status(500).json({
      error: err
    });
  }

  res.status(200).json({
    message: "Document deleted successfully",
    request: {
      type: "POST",
      url: "http://localhost:8080/details",
      body: { name: "String", email: "String", abstract: "String" }
    }
  });
});

module.exports = router;
