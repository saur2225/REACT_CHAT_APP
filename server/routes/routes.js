const express = require('express');
const nodemailer = require('nodemailer');
const { randomUUID } = require('crypto')
const router = express.Router();
const signUpTemplate = require('../models/SignUpModel');
const OTPtemplate = require('../models/otpModel');
const otpModel = require('../models/otpModel');

router.post('/signup', (req, res) => {

    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'saur222509@gmail.com',
            pass: 'yaxocnneqgxbzeca'
        }
    });
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }

    const newOtp = new OTPtemplate({
        otp: OTP,
        email: req.body.email
    })
    newOtp.save().then(data => {
        res.json(data);
    }).catch(error => {
        res.json(error);
    });

    let mailDetails = {
        from: 'saur222509@gmail.com',
        to: req.body.email,
        subject: 'Please verify you email',
        text: `Hello ${req.body.name}. Here is your OTP (one time password) ${OTP} for chat application. Kindly do not share it with anyone. The OTP will expire in next 30 mins.`
    };
      
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs', err);
        } else {
            console.log('Email sent successfully');
            res.send({message: 'Email sent successfully'})
        }
    });



    // signedUpUser.save().then(data => {
    //     res.json(data);
    // }).catch(error => {
    //     res.json(error);
    // });
})

router.post('/checkOTPverification', (req, res) => {
    console.log('called');
        OTPtemplate.find({otp: req.body.otp}, (err, docs) => {
            console.log("uygjhasgfhjf");
            if(err){
                console.log(err);
            }else{
                if(docs[0].otp === req.body.otp){
                    console.log("okokok");
                    const signedUpUser = new signUpTemplate({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        uniqueId: randomUUID(),
                        messages: []
                    })
                        signedUpUser.save().then(data => {
                            res.json(data);
                            // res.send({message:"verification successfull"});
                        }).catch(error => {
                            res.json(error);
                        });
                }
            }
        })
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
            let filteredMsgs = user[0].messages.filter((msg) => msg.room === req.body.room)
            console.log("www", filteredMsgs);
            res.send(filteredMsgs);
        }
    })
})

router.post('/checkUser', (req, res) => {
    console.log(req.body.email);
    signUpTemplate.find({email: req.body.email}, (err, user) => {
        if(err){
            console.log(err);
        }else{
            console.log(user);
            if(user.length === 0){
                const signedUpUser = new signUpTemplate({
                    name: req.body.name,
                    email: req.body.email,
                    uniqueId: randomUUID(),
                    messages: []
                })
                signedUpUser.save().then(data => {
                    res.json(data);
                    res.send(data);
                }).catch(error => {
                    // res.json(error);
                });
                
                res.send({});
            }else{
                res.send(user);
            }
        }
    })
})
module.exports = router