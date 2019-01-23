var express = require('express');
var _ = require('lodash');
var {User} = require('./../models/users');
var {Complaint} = require("./../models/complaint");
const path = require('path');
var router = express.Router();
var async = require('async');
var moment = require('moment');
var mongoose = require("mongoose");
var verifyToken = require('./verify_token');
router.get('/',verifyToken,(req,res)=>{
	let condition = {};
	if (req.query.id) {
		condition['_id'] = mongoose.Types.ObjectId(req.query.id);
	}
	Complaint.find(condition).exec((err,data)=>{
		if (err) {
			return res.status(400).send({
                    timestamp : moment().unix(), 
                    success  : false, 
                    message : "something went wrong",
                    err : err
                });
		}else{
			return res.status(200).send({
                    timestamp : moment().unix(), 
                    success  : true, 
                    message : "data fetched",
                    data : data 
                });
		}
	})
});

router.post('/',verifyToken,(req,res)=>{
	let complaint = new Complaint(req.body);
	complaint.save().then((data)=>{
		return res.status(200).send({
                    timestamp : moment().unix(), 
                    success  : true, 
                    message : "Complaint Created",
                    data : data 
                });
	}).catch((err)=>{
			return res.status(400).send({
                    timestamp : moment().unix(), 
                    success  : false, 
                    message : "something went wrong",
                    err : err
                });
	})
});
router.put('/',verifyToken,(req,res)=>{
	let condition = {};
	if (req.query.id) {
		condition['_id'] = mongoose.Types.ObjectId(req.query.id);
	};
	req.body['modifiedAt'] = new Date();
	let data  = req.body;
	Complaint.update(condition,data).exec((err,data)=>{
		if (err) {
			return res.status(400).send({
                    timestamp : moment().unix(), 
                    success  : false, 
                    message : "something went wrong",
                    err : err
                });
		}else{
			return res.status(200).send({
                    timestamp : moment().unix(), 
                    success  : true, 
                    message : "Updated successfully",
                    data : data 
                });
		}
	})
})

router.delete('/',verifyToken,(req,res)=>{
	let condition = {};
	if (req.query.id) {
		condition['_id'] = mongoose.Types.ObjectId(req.query.id);
	};
	let obj = {
		"modifiedAt" : new Date(),
		"isActive" : false
	}
	Complaint.update(condition,obj).exec((err,data)=>{
		if (err) {
			return res.status(400).send({
                    timestamp : moment().unix(), 
                    success  : false, 
                    message : "something went wrong",
                    err : err
                });
		}else{
			return res.status(200).send({
                    timestamp : moment().unix(), 
                    success  : true, 
                    message : "Updated successfully",
                    data : data 
                });
		}
	})
})

module.exports = router;