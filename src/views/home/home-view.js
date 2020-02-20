"use strict"

module.exports = {
    view: function(model) {
        var body = "<table class='display nowrap dataTable table table-striped no-footer'><thead>";
        body += "<tr>";
        body += "<th></th>";
        body += "<th>Name</th>";
        body += "<th>Last Updated By</th>";
        body += "<th>Last Updated Date</th>"
        body += "</tr></thead><tbody>"
        
        var items = [];
        for (var i = 0; i < model.length; i++) {
            items.push({
                name: model[i],
                updatedBy: "bhein",
                updated: new Date(Date.now()).toLocaleString()
            });
        }

        for (var i = 0;  i < items.length; i++) {
            body += "<tr>"
            body += "<td><a href='/Prod/editor/" + items[i].name + "'><button class='btn btn-sm btn-primary'>View</button></a></td>";
            body += "<td>" + items[i].name + "</td>";
            body += "<td>" + items[i].updatedBy + "</td>";
            body += "<td>" + items[i].updated + "</td>";
            body += "</tr>";
        }


        body += "</tbody></table>";
        return require("../layout-binder").bind(body);
    }
}