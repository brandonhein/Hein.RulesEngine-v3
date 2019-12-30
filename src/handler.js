'use strict'

var serverless = require("serverless-http");
var bodyParser = require("body-parser");
var express = require("express");
var middleware = require("./middleware");
var executor = require("./rule-executor");
var service = require("./services/code-conversion-service");
var viewEngine = require("./views/view-engine");


var app = express();
app.use(bodyParser.text());
app.use(bodyParser.json());

app.use(express.static(`${__dirname}/wwwroot`));

app.use(function (req, res, next) {
    middleware.setup(req, res, next);
});

app.route("/")
    .get(function (req, res) {
        var view = viewEngine.display("home");
        res.setHeader("Content-Type", "text/html");
        res.end(view);
    });

app.route("/swagger")
    .get(function (req, res) {
        var view = viewEngine.display("swagger");
        res.setHeader("Content-Type", "text/html");
        res.end(view);
    });

/********************** api endpoints **********************/
app.route("/execute")
    .post(function(req, res){
        executor.applyAsync(req.body)
            .then((result) => {
                res.end(JSON.stringify(result));
            });
    });

app.route("/convert")
    .post(function(req, res) {
        var bodyText = req.body.toString();
        service.adminCodeToJavascript(bodyText)
            .then((result) => {
                res.setHeader("Content-Type", "text/plain");
                res.end(result);
            });
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
    app.listen(5000, function(req, res){
        console.log("Hein.RulesEngine-v3 is running on port: 5000");
    });
}