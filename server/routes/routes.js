const express = require('express');
const { randomUUID } = require('crypto')
const router = express.Router();
const signUpTemplate = require('../models/SignUpModel');

router.post('/signup', (req, res) => {
    const signedUpUser = new signUpTemplate({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        uniqueId: randomUUID(),
        messages: []
    })

    signedUpUser.save().then(data => {
        res.json(data);
    }).catch(error => {
        res.json(error);
    });
})

router.post('/login', (req, res) => {
    signUpTemplate.find({ email: req.body.email},  (err, docs) => {
        if (err){
            console.log(err);
        }
        else{
            console.log("from server", docs);
            res.send(docs);
        }
    });
})

router.get('/allUser', (req, res) => {
    signUpTemplate.find({}, function(err, users) {
        // var userMap = {};
        // users.forEach(function(user) {
        //   userMap[user._id] = user;
        // });
    
        res.send(users);  
      });
})

router.post('/getAllMsgs', (req, res) => {
    signUpTemplate.find({email: req.body.email}, (err, user) => {
        if(err){
            console.log(err);
        }else{
            console.log("wowww", user);
            res.send(user);
        }
    })
})
module.exports = router