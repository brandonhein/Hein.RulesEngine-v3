'use strict'

module.exports = {
    setup: function (req, res, next) {
        try {
            for (var key in req.query) {
                req.query[key.toLowerCase()] = req.query[key];
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Content-Type", "application/json");

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