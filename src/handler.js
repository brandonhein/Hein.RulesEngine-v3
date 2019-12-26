'use strict'

var serverless = require("serverless-http");
var bodyParser = require("body-parser");
var express = require("express");
var middleware = require("./middleware");


var app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {
    middleware.setup(req, res, next);
});

app.route("/execute")
    .post(function(req, res){
        
    });

app.use(function (err, req, res, next){
    middleware.errorHandling(err, req, res, next);
});

//Lambda - HTTP API
module.exports.proxy = serverless(app);