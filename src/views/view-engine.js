'use strict'

module.exports = {
    display: function(view, model) {
        switch (view.toLowerCase()) {
            case "home":
                return require("./home/home-view").view(model);
            case "new-editor":
                return require("./rule-editor/rule-editor-view").newView();
            case "editor":
                return require("./rule-editor/rule-editor-view").view(model);
            case "swagger":
                return require("./swagger/swagger-view").view();
        }
    }
}