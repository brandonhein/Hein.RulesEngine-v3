'use strict'
var codeFetcher = require("./rule-fetcher");
var vm = require("vm");

module.exports = {
    applyAsync: async function(request) {
        
        var dynamicCode = await codeFetcher.fetchAsync(request.rule);
        vm.createContext(request);

        vm.runInContext(dynamicCode, request);

        var response = {
            rule: request.rule,
            values: request.values
        }
        return response;
    }
}