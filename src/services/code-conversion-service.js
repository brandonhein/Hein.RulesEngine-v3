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

                    var atNulls = resultCode.match(/\@null/g);
                    if (atNulls) {
                        for (var i = 0; i < emptyValues.length; i++){
                            resultCode = resultCode.replace("@null", "null");
                        }
                    }

                    var allPushMatches = resultCode.match(/].Add/g);
                    for (var i = 0; i < allPushMatches.length; i++) {
                        resultCode = resultCode.replace("].Add", "].push");
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