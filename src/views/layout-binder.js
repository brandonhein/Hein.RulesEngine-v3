"use strict"

var fs = require("fs");

module.exports = {
    bind: function(body) {
        var template = fs.readFileSync(__dirname + "/_layout.html", "utf-8");
        return template.replace("{{{RENDERBODY}}}", body);
    }
}