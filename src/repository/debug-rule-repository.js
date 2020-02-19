"use strict"

var fs = require("fs");

module.exports = {
    getAllRulesAsync: async function() {

    },
    getRuleAsync: async function(ruleSetName) {
        var fileName = __dirname + "/../sample/" + ruleSetName + ".txt";

        console.log(fileName);
        var content = fs.readFileSync(fileName, 'utf-8');

        return {
            RuleSet: ruleSetName,
            AdminCode: "ope_debugging",
            EngineCode: content
        };
    },
    saveAsync: async function(ruleEntity) {
        return true;
    },
    getRuleSetNamesAsync: async function() {
        return [ "state_order", "next_status_rule", "product_eligibility" ];
    }
}