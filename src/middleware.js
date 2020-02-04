'use strict'

module.exports = {
    setup: function (req, res, next) {
        try {
            for (var key in req.query) {
                req.query[key.toLowerCase()] = req.query[key];
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Content-Type", "application/json");
            res.setHeader("x-engine-by", "brandonhein");
            var result = Math.floor(Math.random() * Math.floor(2));
            res.setHeader("sonic-or-flash", result == 1 ? "sonic" : "flash");

            var request = {
                method: req.method,
                path: req._parsedUrl.pathname,
                query: req._parsedUrl.query,
                headers: req.headers,
                body: req.body
            }
            console.log(JSON.stringify(request));

            const startHrTime = process.hrtime();
            res.on("finish", () => {
                const elapsedHrTime = process.hrtime(startHrTime);
                const elapsedTimeInMs = (elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6) + 1;

                var response = {
                    status: res.statusMessage,
                    statusCode: res.statusCode,
                    responseTime: elapsedTimeInMs + "ms"
                }
                console.log(JSON.stringify(response));
              });

            next();


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