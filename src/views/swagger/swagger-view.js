'use strict'

var fs = require("fs");

module.exports = {
    view: function() {
        var html = fs.readFileSync(__dirname + "/swagger.html", "utf-8");
        return html;
    }
}