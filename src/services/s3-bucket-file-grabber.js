'use strict'

var fs = require('fs');
var AWS = require('aws-sdk');

module.exports = {
    getFileAsync: async function(file) {
        var path = "hein-rules-engine-rulestore/" + file + ".txt";
        var params = {Bucket: process.env.BUCKETNAME, Key: path}
        var data = await new AWS.S3().getObject(params).promise();
        var content = data.Body.toString('utf-8');

        return content;
    }
};