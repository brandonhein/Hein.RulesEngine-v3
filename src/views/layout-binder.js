"use strict"

var fs = require("fs");

module.exports = {
    bind: function(body) {
        var template = fs.readFileSync(__dirname + "/_layout.html", "utf-8");

        //if (process.env.NODE_ENV) {
        //    template.replace("{{{urlStage}}}}", "../" + process.env.NODE_ENV);
        //}
        //else {
        //    template.replace("{{{urlStage}}}}", "../");
        //}

        return template.replace("{{{RENDERBODY}}}", body);
    }
}