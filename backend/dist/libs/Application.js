"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var express = require("express");
var config_1 = require("../config");
var Database_1 = require("./Database");
var express_1 = require("express");
var Socket_1 = require("./Socket");
var App = /** @class */ (function () {
    function App(serverArg) {
        /**
         * This class handles all the handlers, middleware, public folders and server creation!
         */
        this.__port = config_1.SERVER.port;
        this.__address = config_1.SERVER.address;
        this.__app = express();
        this.__middleware = serverArg.middleware;
        this.__assetsPath = serverArg.assetsPath;
        this.__handlers = serverArg.handlerModule;
        this.__database = new Database_1.Database();
        this.__loadMiddleware();
        this.__loadAssets();
        this.__loadHandlers();
    }
    App.prototype.__loadMiddleware = function () {
        var _this = this;
        this.__middleware.forEach(function (middleware) {
            _this.__app.use(middleware);
        });
    };
    App.prototype.__loadHandlers = function () {
        var _this = this;
        this.__handlers.forEach(function (handler) {
            var handlerObject = new handler.handler();
            handlerObject.databaseConnector(_this.__database);
            var redirectLink = express_1.Router();
            redirectLink.all(handler.path, handlerObject.router());
            _this.__app.use('/', redirectLink);
        });
    };
    App.prototype.__loadAssets = function () {
        var _this = this;
        this.__assetsPath.forEach(function (path) {
            _this.__app.use(express.static(__dirname + path));
        });
    };
    App.prototype.listen = function () {
        var _this = this;
        var listener = this.__app.listen(this.__port, this.__address, function () {
            console.log('Server started...');
            console.log("Server Credentials:\n            Address: " + _this.__address + "\n            Port: " + _this.__port);
        });
        new Socket_1.Socket(listener);
    };
    return App;
}());
exports.App = App;
