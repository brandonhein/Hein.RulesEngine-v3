"use strict"

var http = require("request-promise");

module.exports = {
    get: function(url, headers) {
        var parameters = {
            method: "GET",
            uri: url,
            time: true,
            timeout: 60000,
            json: true,
            rejectUnauthorized: false,
            resolveWithFullResponse: true,
            headers: headers
        };

        return doApiCall(parameters);
    },
    post: function(url, body, headers) {
        var parameters = {
            method: "POST",
            uri: url,
            body: body,
            time: true,
            timeout: 60000,
            json: true,
            rejectUnauthorized: false,
            resolveWithFullResponse: true,
            headers: headers
        };

        return doApiCall(parameters);
    }
}

var doApiCall = function(parameters) {
    var results = http(parameters)
        .then(function(res) {
            return res;
        })
        .catch(function(err) {
            return err;
        });
    return results;
}