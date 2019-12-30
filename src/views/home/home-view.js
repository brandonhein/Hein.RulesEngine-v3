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
        items.push({
            name: "next_status_rule",
            updatedBy: "bhein",
            updated: Date.now()
        });
        items.push({
            name: "is_event_id_a_status",
            updatedBy: "bhein",
            updated: Date.now()
        });

        for (var i = 0;  i < items.length; i++) {
            body += "<tr>"
            body += "<td><button class='btn btn-sm btn-primary'>View</button></td>";
            body += "<td>" + items[i].name + "</td>";
            body += "<td>" + items[i].updatedBy + "</td>";
            body += "<td>" + items[i].updated + "</td>";
            body += "</tr>";
        }


        body += "</tbody></table>";
        return require("../layout-binder").bind(body);
    }
}