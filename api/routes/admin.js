const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Bcrypt } = require("bcrypt-rust-wasm");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const log = require("console-debug-log");
const Admin = require("../models/admin");
const bcrypt = Bcrypt.default();

router.post(
  "/signup",
  [check("email").isEmail(), check("password").isLength({ min: 7 , max: 32}), check("isAdmin").isBoolean()],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array()
      });
    }

    Admin.find({ email: req.body.email })
      .exec()
      .then(admin => {
        if (admin.length >= 1) {
          return res.status(409).json({
            message: "Mail exists"
          });
        } else {
          const token = jwt.sign(req.body.email, process.env.JWT_PASS);
          const hash = bcrypt.hashSync(req.body.password, process.env.JWT_PASS);
          const admin = new Admin({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
            isAdmin: req.body.isAdmin
          });
          admin
            .save()
            .then(result => {
              console.log(result);
              res.status(201).json({
                message: "User created",
                token: token
              });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err
              });
            });
        }
      });
  }
);

router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 7 , max: 32 })],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array()
      });
    }
    Admin.find({ email: req.body.email })
      .exec()
      .then(admin => {
        if (admin.length < 1) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        const result = bcrypt.verifySync(req.body.password, admin[0].password);
        if (result) {
          const token = jwt.sign(req.body.email, process.env.JWT_PASS);
          return res.status(200).json({
            message: "Auth successful",
            token: token  
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
);

module.exports = router;
