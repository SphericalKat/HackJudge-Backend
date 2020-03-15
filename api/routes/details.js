const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const log = require("console-debug-log");
const jwt = require("jsonwebtoken");
const Details = require("../models/details");

router.post("/", (req, res) => {
  log.debug(req.body);
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
  const token = req.header("Authorization");
  let isValid = false;
  let email;
  try {
    email = jwt.verify(token, process.env.JWT_PASS);
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      message: err
    });
  }
  const id = req.params.detailsId;
  Details.where({
    email: email
  })
    .findOne()
    .exec()
    .then(result => {
      isValid = result.email === email;
      const updateOps = {};
      if (!isValid) {
        return res.status(403).json({
          message: "You are forbidden from modifying this resource"
        });
      }
      for (const ops of Object.keys(req.body)) {
        updateOps[ops] = req.body[ops];
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
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
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
