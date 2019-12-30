'use strict'

var fs = require("fs");
var bucketReader = require("./services/s3-bucket-file-grabber");

module.exports = {
    fetchAsync: async function(ruleSetName) {
        //var localSpot = "/tmp/" + ruleSetName + ".txt";
        var localSpot = "./src/sample/" + ruleSetName + ".txt";

        var ruleCode = "";
        try{
            if (fs.existsSync(localSpot)) {
                ruleCode = fs.readFileSync(localSpot, 'utf-8');
            }
            else {
                ruleCode = await bucketReader.getFile(ruleSetName)
            }
        }
        catch {
            ruleCode = await bucketReader.getFile(ruleSetName)
        }
        finally {
            return ruleCode;
        }
        
    }
}