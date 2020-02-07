const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin");

router.post("/signup", (req, res) => {
  Admin.find({ email: req.body.email })
    .exec()
    .then(admin => {
      if (admin.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        const token = jwt.sign(req.body.email, process.env.JWT_PASS);
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const admin = new Admin({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            admin
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "Admin created",
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
    });
});

router.post("/login", (req, res) => {
  Admin.find({ email: req.body.email })
    .exec()
    .then(admin => {
      if(admin.length<1){
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      bcrypt.compare(req.body.password, admin[0].password, (err,result) =>{
        if(err){
          return res.status(401).json({
            message: 'Auth failed'
          });
        }
        if(result){
          return res.status(200).json({
            message: 'Auth successful'
          });
        }
        res.status(401).json({
          message: 'Auth failed'
        });
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
