'use strict'

module.exports = {
    display: function(view, model) {
        switch (view.toLowerCase()) {
            case "home":
                return require("./home/home-view").view();
            case "swagger":
                return require("./swagger/swagger-view").view();
        }
    }
}