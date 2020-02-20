
var fs = require("fs");

module.exports = {
    newView: function() {
        var body = fs.readFileSync(__dirname + "/rule-editor-template.html", "utf-8");

        var newRuleNameSection = "<div class='form-group form-group-lg'>";
        newRuleNameSection += "<label for='nameTextBox'>Rule Name (lower_snake_case_preferred):</label>";
        newRuleNameSection += "<input id='nameTextBox' name='RuleSet' class='form-control form-control-lg' type='text' autocomplete='off'/>";
        newRuleNameSection += "</div>";

        body = body.replace("{{{RULE-RULENAME}}}", newRuleNameSection);
        body = body.replace("{{{RULE-ADMINCODE}}}", "");
        body = body.replace("{{{RULE-ENGINECODE}}}", "");
        body = body.replace("{{{RULE-HISTORY}}}", "");

        return require("../layout-binder").bind(body);
    },
    view: function(model) {
        var body = fs.readFileSync(__dirname + "/rule-editor-template.html", "utf-8");

        var ruleNameSection = "<h3>" + model.RuleSet + "</h3>";
        ruleNameSection += "<input type='hidden' name='FriendlyKey' value='" + model.RuleSet + "' />";

        body = body.replace("{{{RULE-RULENAME}}}", ruleNameSection);
        body = body.replace("{{{RULE-ADMINCODE}}}", model.AdminCode);
        body = body.replace("{{{RULE-ENGINECODE}}}", model.EngineCode);

        var changeHistory = "";
        //for (var i = 0;  i < model.changeHistory; i++) {
            changeHistory += "<tr>"
            changeHistory += "<td>" + "v" + 1 + "</td>";
            changeHistory += "<td>" + "bhein" + "</td>";
            changeHistory += "<td>" + new Date(Date.now()).toISOString() + "</td>";
            changeHistory += "<td>" + "init" + "</td>";
            changeHistory += "</tr>";
        //}

        body = body.replace("{{{RULE-HISTORY}}}", changeHistory);

        return require("../layout-binder").bind(body);
    }
}