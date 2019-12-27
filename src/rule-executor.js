'use strict'
var codeFetcher = require("./rule-fetcher");
var vm = require("vm");

module.exports = {
    apply: function(request) {
        
        var dynamicCode = codeFetcher.fetch(request.rule);
        vm.createContext(request);

        vm.runInContext(dynamicCode, request);

        var response = {
            rule: request.rule,
            values: request.values
        }
        return response;
    }
}