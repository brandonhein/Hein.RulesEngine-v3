'use strict'

var fs = require("fs");

module.exports = {
    fetch: function(ruleSetName) {
        var location = "./src/sample/" + ruleSetName + ".txt";
        var data = fs.readFileSync(location, "utf8");
        return data;
    }
}