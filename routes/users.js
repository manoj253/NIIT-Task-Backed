var express = require('express');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var {User} = require('./../models/users');
const path = require('path');
var router = express.Router();
var async = require('async');
var moment = require('moment');
var jwt = require("jsonwebtoken");

var verifyToken = require('./verify_token');

// router.use(verifyToken);  // verify token with jwt lib and server secret key
router.post('/login', (req, res) => {
  console.log(req.body);
  User.findOne({email: req.body.email}).then((doc) => {
    if(doc){
      bcrypt.compare(req.body.password, doc.password, (err, resp) => {
        if(resp) {
          let exp = moment().valueOf() + (6 * 30 * 24 * 60 * 60 * 60 * 60 * 1000);//
           let tData = {
                        id: doc._id,
                        loginId : doc._id,
                        iat : moment().valueOf(),
                        exp : exp
                    };
                    let token = jwt.sign(tData,"secret", {
                        // expiresIn: 6 * 30 * 24 * 3600 // expires
                        //expiresIn: 6 // expires
                    });
          return res.status(200).send({
                    timestamp : moment().unix(), 
                    success  : true,
                    token : token,
                    message : "Logged in sucessfully",
                   
                });
        }else {
           return res.status(400).json({
                    timestamp : moment().unix(),
                    success : false,
                    message  : "Email or Password not matching!",
                });
        }
      });
    }else {
       return res.status(400).json({
                    timestamp : moment().unix(),
                    success : false,
                    message  : "User Not Found",
                    
                });
    }
  }).catch((err) => {
    console.log(err);
     return res.status(400).json({
                    timestamp : moment().unix(),
                    success : false,
                    message  : "Sorry! Cannot login",
                    data : data
                });
  });
});

router.post('/signup', (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var password = req.body.password;
  console.log("body",req.body)
  let user = new User(req.body);
  user.save().then((doc)=>{
       return res.status(200).send({
                    timestamp : moment().unix(), 
                    success  : true, 
                    message : "User Created successfully",
                   
                });
  }).catch((err)=>{
    let message = err;
    if (err.code == 11000) {
      message = "email already exist"
    }
    return res.status(400).json({
              timestamp : moment().unix(),
              success : false,
              message  : message,
              err : err
              
          });

  })
  
  
  
});

router.get('/list',verifyToken,(req,res)=>{
    User.find({}).exec((err,data)=>{
      if (err) {
          return res.status(400).json({
              timestamp : moment().unix(),
              success : false,
              message  : "Something went wrong",
              err : err
              
          });
      }else{
        console.log("decoded",req.decoded)
        return res.status(200).send({
                    timestamp : moment().unix(), 
                    success  : true, 
                    message : "data fetched",
                    data : data 
                });
      }
    })
})

module.exports = router;