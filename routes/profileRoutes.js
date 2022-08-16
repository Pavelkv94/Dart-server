const express = require('express');
const authMiddleware = require('../auth/middleware/authMiddleware');
const UserProfile = require('../models/UserProfile');
var fs = require('fs');


const server = express();

server.get('/profile/:user_id', authMiddleware, (req, res) => {
    UserProfile.findOne({user_id: req.params.user_id}).exec((err, data) => {
        if (err) return res.status(400).json({ err });
        res.json(data);
      });
})

server.put('/profile/photo', authMiddleware, (req, res) => {
  console.log(req.body)
  // UserProfile.findOne({user_id: req.params.user_id}).exec((err, data) => {
  //     if (err) return res.status(400).json({ err });
  //     res.json(data);
  //   });
})

module.exports = server;