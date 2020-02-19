'use strict'

let repository;
if (process.env.NODE_ENV) {
    repository = require("./repository/rule-repository");
}
else {
    repository = require("./repository/debug-rule-repository");
}

module.exports = {
    fetchAsync: async function(ruleSetName) {

        var result = await repository.getRuleAsync(ruleSetName);
        return result.EngineCode;
    }
}