'use strict'

module.exports = {
    fetch: function(ruleSetName) {
        return "values[\"EventId\"] += values[\"StatusId\"]";
    }
}