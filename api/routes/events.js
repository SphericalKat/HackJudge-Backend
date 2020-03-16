const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const log = require("console-debug-log");
const Events = require("../models/events");

router.get("/", [check("Authorization")], (req, res) => {
  // handle validation
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      error: error.array()
    });
  }

  // validate jwt
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

  // jwt verified, find event by ID
  Events.find()
    .select("problemStatements rounds metric name _id")
    .exec()
    .then(docs => {
      if (docs) {
        res.status(200).json(docs);
      } else {
        res.status(404).json({
          message: "no events found"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", [check("Authorization")], (req, res) => {
  log.debug(req.body);
  // handle validation
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      error: error.array()
    });
  }

  // verify jwt
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

  // jet verified, save events
  const events = new Events({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    eventDetails: req.body.eventDetails
  });
  events.save().then(result => {
    console.log(result);
    res.status(201).send({
      message: "Create event successfully",
      createdProduct: {
        _id: result._id,
        name: result.name,
        problemStatements: result.problemStatements,
        rounds: result.rounds,
        metric: result.metric
      }
    });
  });
});

router.get("/:eventsId", [check("Authorization")], (req, res) => {
  // handle validation
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      error: error.array()
    });
  }

  // verify jwt
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

  // jwt verified, find event by ID
  const id = req.params.eventsId;
  Events.findById(id)
    .select("problemStatements rounds metric name _id")
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

router.patch("/:eventsId", [check("Authorization")], (req, res) => {
  // handle validation
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      error: error.array()
    });
  }

  // verify jwt
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

  // jwt verified, find fields to update
  const id = req.params.eventsId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  // update fields
  Events.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "Event updated",
        request: {
          type: "GET",
          url: "http://localhost:8080/events/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:eventsId", [check("Authorization")], async (req, res) => {
  // handle validation
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      error: error.array()
    });
  }

  // verify jwt
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

  // jwt verified, delete event
  const id = req.params.eventsId;
  let result;
  try {
    result = await Events.remove({ _id: id }).exec();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }

  res.status(200).json({
    message: "Event deleted successfully",
    request: {
      type: "POST",
      url: "http://localhost:8080/events",
      body: { name: "String", email: "String", abstract: "String" }
    }
  });
});

module.exports = router;
