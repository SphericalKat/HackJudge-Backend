const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const log = require("console-debug-log");
const Events = require("../models/events");

router.get("/", (req, res) => {
  console.log(req.headers.host);
  Events.find()
    .select("problemStatements rounds metric name _id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        events: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            problemStatements: doc.problemStatements,
            rounds: doc.rounds,
            metric: doc.metric
          };
        })
      };
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

router.post("/", (req, res) => {
  console.log(req.body);
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

router.get("/:eventsId", (req, res) => {
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

router.patch("/:eventsId", (req, res) => {
  const id = req.params.eventsId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Events.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
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

router.delete("/:eventsId", async (req, res) => {
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

