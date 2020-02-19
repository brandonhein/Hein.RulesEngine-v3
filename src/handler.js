'use strict'

var serverless = require("serverless-http");
var bodyParser = require("body-parser");
var express = require("express");
var responseTime = require('response-time')
var middleware = require("./middleware");
var executor = require("./rule-executor");
var service = require("./services/code-conversion-service");
var viewEngine = require("./views/view-engine");
var repository = require("./repository/rule-repository");


var app = express();
app.use(responseTime());
app.use(bodyParser.text());
app.use(bodyParser.json());

app.use(express.static(`${__dirname}/wwwroot`));

//route the /Prod url to index
app.route("/")
    .all(function (req, res) {
        res.redirect('/Prod/index');
    });

app.use(function (req, res, next) {
   middleware.setup(req, res, next);
});

app.route("/home")
    .all(function (req, res) {
        res.redirect('/Prod/index');
    });

app.route("/index")
    .all(function (req, res) {
        repository.getRuleSetNamesAsync()
            .then((results) => {
                var view = viewEngine.display("home", results);
                res.setHeader("Content-Type", "text/html");
                res.send(view);
            });
    });

app.route("/swagger")
    .get(function (req, res) {
        var view = viewEngine.display("swagger");
        res.setHeader("Content-Type", "text/html");
        res.send(view);
    });

app.route("/playground")
    .get(function (req, res) {

    });

app.route("/playground/:ruleName")
    .get(function (req, res) {
        repository.getRuleAsync(req.params.ruleName)
            .then((result) => {

                res.send(JSON.stringify(result));
            });
    });

/********************** api endpoints **********************/
app.route("/execute")
    .post(function(req, res){
        executor.applyAsync(req.body)
            .then((result) => {
                res.send(JSON.stringify(result));
            });
    });

app.route("/convert")
    .post(function(req, res) {
        var bodyText = req.body.toString();
        service.adminCodeToJavascript(bodyText)
            .then((result) => {
                res.setHeader("Content-Type", "text/plain");
                res.send(result);
            });
    });

app.route('/rule')
    .get(function (req, res) {
        repository.getRuleSetNamesAsync()
            .then((results) => {
                var haleoas = [];
                for (var i = 0; i < results.length; i++) {
                    var links = [];
                    links.push({ href: "/Prod/rule/" + results[i], rel: "rule", type: "GET"});

                    haleoas.push({
                        ruleName: results[i],
                        _links: links
                    });
                }

                res.send(JSON.stringify(haleoas));
            });
    })
    .post(function (req, res) {
        repository.saveAsync(req.body)
            .then((result) => {
                res.setHeader("Content-Type", "text/plain");
                res.send("OK");
            });
    });

app.route('/rule/:ruleName')
    .get(function (req, res) {
        repository.getRuleAsync(req.params.ruleName)
            .then((result) => {
                res.send(JSON.stringify(result));
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