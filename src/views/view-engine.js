'use strict'

module.exports = {
    display: function(view, model) {
        switch (view.toLowerCase()) {
            case "home":
                return require("./home/home-view").view(model);
            case "new-playground":
                return require("./playground").view();
            case "playground":
                return require("./playground").view(model);
            case "swagger":
                return require("./swagger/swagger-view").view();
        }
    }
}