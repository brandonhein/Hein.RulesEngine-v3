'use strict'
var codeFetcher = require("./rule-fetcher");
var vm = require("vm");

module.exports = {
    applyAsync: async function(request) {
        var caps = false;
        if (!request.rule) {
            caps = true;
            request = {
                rule: request.Rule,
                values: request.Values
            }
        }

        var dynamicCode = await codeFetcher.fetchAsync(request.rule);
        vm.createContext(request);

        vm.runInContext(dynamicCode, request);

        var response;
        if (caps) {
            response = {
                Rule: request.rule,
                Values: request.values
            }
        }
        else {
            response = {
                rule: request.rule,
                values: request.values
            }
        }
        return response;
    }
}