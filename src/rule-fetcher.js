'use strict'

var fs = require("fs");
var repository = require("./repository/rule-repository");
//var bucketReader = require("./services/s3-bucket-file-grabber");

module.exports = {
    fetchAsync: async function(ruleSetName) {

        var result = await repository.getRuleAsync(ruleSetName);
        return result.EngineCode;
    }
}