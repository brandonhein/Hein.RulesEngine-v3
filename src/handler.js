'use strict'

var serverless = require("serverless-http");
var bodyParser = require("body-parser");
var express = require("express");
var middleware = require("./middleware");
var executor = require("./rule-executor");


var app = express();
app.use(bodyParser.json());

app.use(express.static(`${__dirname}/wwwroot`));

app.use(function (req, res, next) {
    middleware.setup(req, res, next);
});

app.route("/")
    .get(function (req, res) {
        res.redirect("/swagger.html");
    });

app.route("/swagger")
    .get(function (req, res) {
        res.redirect("/swagger.html");
    });

app.route("/execute")
    .post(function(req, res){
        var result = executor.apply(req.body);
        res.end(JSON.stringify(result));
    });

app.use(function (err, req, res, next){
    middleware.errorHandling(err, req, res, next);
});

//run in lambda or run locally :)
if (process.env.NODE_ENV) {
    //Lambda - HTTP API
    module.exports.proxy = serverless(app);
}
else {
    require("./local/debug").start(app);
}