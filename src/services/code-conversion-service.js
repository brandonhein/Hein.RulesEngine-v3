"use strict"

var http = require("./http-service");

module.exports = {
    adminCodeToCSharp: function(adminCode) {
        var body = {
            code: adminCode,
            requestedConversion: "vbnet2cs"
        };
        var result = http.post("https://codeconverter.icsharpcode.net/api/converter/", body, null)
            .then((result) => {
                return result.body;
            })
            .catch((err) => {
                console.log(err);
                return null;
            })
        return result;
    },
    /**
     * because basic if conditions in c# and javascript are pretty damn close... lets follow this magic:
     * https://github.com/brandonhein/Hein.RulesEngine-v2/blob/master/src/RulesEngine.Domain/Magic/AdminToEngineCodeConversion.cs#L46
     */
    adminCodeToJavascript: function(adminCode) {
        var temps = adminCode.match(/temp /g);
        if (temps) {
            adminCode = adminCode.replace("temp ", "Dim ");
        }

        var atNulls = adminCode.match(/\@null/g);
        if (atNulls) {
            for (var i = 0; i < atNulls.length; i++) {
                adminCode = adminCode.replace("@null", "_NULL_");
            }
        }

        var atNows = adminCode.match(/\@now/g);
        if (atNows) {
            for (var i = 0; i < atNows.length; i++) {
                adminCode = adminCode.replace("@now", "now");
            }
        }

        var atTodays = adminCode.match(/\@today/g);
        if (atTodays) {
            for (var i = 0; i < atTodays.length; i++) {
                adminCode = adminCode.replace("@today", "today");
            }
        }

        var quotesInside = adminCode.match(/\[\"/g);
        if (quotesInside) {
            for (var i = 0; i < quotesInside.length; i++) {
                adminCode = adminCode.replace('[\"', '[');
            }
        }

        var quotesInside2 = adminCode.match(/\"\]/g);
        if (quotesInside2) {
            for (var i = 0; i < quotesInside2.length; i++) {
                adminCode = adminCode.replace('\"]', ']');
            }
        }

        var matches = adminCode.match(/\[(.*?)\]/g);
        var specialGroups = [];

        for (var i = 0; i < matches.length; i++) {
            var specialGroup = matches[i].replace('[', '[___f_').replace(']', '_e___]');
            specialGroups.push(specialGroup);
            adminCode = adminCode.replace(matches[i], specialGroup);
        }

        var resultCode = "";
        var worker = this.adminCodeToCSharp(adminCode)
            .then((result) => {
                if (result.conversionOk && !result.convertedCode.includes('ICSharpCode.CodeConverter')) {
                    resultCode = result.convertedCode.substring(1);
                    resultCode = resultCode.slice(0, -3);

                    //TODO add extension prototypes

                    var declarables = "/** Awesome constant params we levarage **/\n" +
                        "var now = new Date(Date.now()).toISOString();\n" +
                        "var today = now.slice(0,10);\n";

                    resultCode = declarables + resultCode;

                    var fMatches = resultCode.match(/___f_/g);
                    var eMatches = resultCode.match(/_e___/g);

                    for (var i = 0; i < fMatches.length; i++) {
                        resultCode = resultCode.replace('___f_', 'values[\"');
                    }
                    for (var i = 0; i < eMatches.length; i++) {
                        resultCode = resultCode.replace('_e___', '\"]');
                    }

                    var emptyValues = resultCode.match(/values\[\"\"\]/g);
                    if (emptyValues) {
                        for (var i = 0; i < emptyValues.length; i++){
                            resultCode = resultCode.replace('values[\"\"]', '[]');
                        }
                    }

                    var atNulls = resultCode.match(/_NULL_/g);
                    if (atNulls) {
                        for (var i = 0; i < atNulls.length; i++){
                            resultCode = resultCode.replace("_NULL_", "null");
                        }
                    }

                    var allPushMatches = resultCode.match(/].add/g);
                    if (allPushMatches) {
                        for (var i = 0; i < allPushMatches.length; i++) {
                            resultCode = resultCode.replace("].add", "].push");
                        }
                    }

                    var allPushMatches2 = resultCode.match(/].Add/g);
                    if (allPushMatches2) {
                        for (var i = 0; i < allPushMatches2.length; i++) {
                            resultCode = resultCode.replace("].Add", "].push");
                        }
                    }

                    var allIncludeMatches = resultCode.match(/].contains/g);
                    if (allIncludeMatches) {
                        for (var i = 0; i < allIncludeMatches.length; i++) {
                            resultCode = resultCode.replace("].contains", "].includes");
                        }
                    }

                    var allIncludeMatches2 = resultCode.match(/].Contains/g);
                    if (allIncludeMatches2) {
                        for (var i = 0; i < allIncludeMatches2.length; i++) {
                            resultCode = resultCode.replace("].Contains", "].includes");
                        }
                    }

                    return resultCode;
                }
                else {
                    return "error converting admin code to engine code";
                }
            })
            .catch((error) =>
            {
                console.log(error);
                return "error converting admin code to engine code";
            });

        return worker;
    }
}