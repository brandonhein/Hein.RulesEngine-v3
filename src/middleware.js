'use strict'
var Stopwatch = require("node-stopwatch").Stopwatch;

module.exports = {
    setup: function (req, res, next) {
        try {
            for (var key in req.query) {
                req.query[key.toLowerCase()] = req.query[key];
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Content-Type", "application/json");
            res.setHeader("x-engine", "hein.rulesengine");


            var request = {
                method: req.method,
                path: req._parsedUrl.pathname,
                query: req._parsedUrl.query,
                headers: req.headers,
                body: req.body
            }
            console.log(JSON.stringify(request));

            var stopwatch = Stopwatch.create();
            stopwatch.start();

            next();

            stopwatch.stop();

            var response = {
                status: res.statusMessage,
                statusCode: res.statusCode,
                responseTime: stopwatch.elapsedMilliseconds + "ms"
            }
            console.log(JSON.stringify(response));

        } catch (error) {
            next(error);
        }
    },
    errorHandling: function (err, req, res, next) {
        if (err.statusCode){
            res.status(err.statusCode).send(err);
        } else {
            res.status(500).send({message: err.message});
        }
    }
}