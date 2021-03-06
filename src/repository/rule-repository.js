"use strict"

var AWS = require('aws-sdk');

//TODO for justin... expiration dates
var cachedRuleSets = [];

module.exports = {
    getAllRulesAsync: async function() {

    },
    getRuleAsync: async function(ruleSetName) {
        //check cached results
        if (cachedRuleSets.filter(r => r.RuleSet === ruleSetName).length > 0) {
            return cachedRuleSets.filter(r => r.RuleSet === ruleSetName)[0];
        }

        //otherwise go to dynamo to get it and cache it
        var params = {
            TableName: 'RuleEntity',
            Key: {
                'RuleSet': {S: ruleSetName}
            }
        };

        var db = new AWS.DynamoDB();
        var ruleEntity = await db.getItem(params).promise();

        var result = {
            RuleSet: ruleEntity.Item.RuleSet.S,
            AdminCode: ruleEntity.Item.AdminCode.S,
            EngineCode: ruleEntity.Item.EngineCode.S
        };

        cachedRuleSets.push(result);
        return result;
    },
    saveAsync: async function(ruleEntity) {
        var params = {
            TableName: 'RuleEntity',
            Item: {
                RuleSet: {S: ruleEntity.RuleSet},
                AdminCode: {S: ruleEntity.AdminCode},
                EngineCode: {S: ruleEntity.EngineCode}
            },
            ReturnConsumedCapacity: "TOTAL"
        };

        var db = new AWS.DynamoDB();
        var result = await db.putItem(params).promise();

        return result != null;
    },
    getRuleSetNamesAsync: async function() {
        var params = {
            ProjectionExpression: "RuleSet",
            TableName: "RuleEntity"
        };

        var db = new AWS.DynamoDB();
        var result = await db.scan(params).promise();
        
        var results = [];
        for (var i = 0; i < result.Items.length; i++) {
            results.push(result.Items[i].RuleSet.S);
        }

        return results;
    }
}