var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require("cors");
mongoose.Promise = global.Promise;
// var connection = mongoose.connect('mongodb://localhost/niit');
mongoose.connect("mongodb://localhost:27017/niit", { useNewUrlParser: true });
var user = require('./routes/users');
var complaint = require('./routes/complaint');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

app.use('/api',complaint);
app.use('/api/user',user);


module.exports = app;