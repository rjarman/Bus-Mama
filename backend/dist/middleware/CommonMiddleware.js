"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permissions = exports.BodyParserURLEncoded = exports.BodyParser = void 0;
var bodyParser = require("body-parser");
exports.BodyParser = (function () {
    return bodyParser.json();
})();
exports.BodyParserURLEncoded = (function () {
    return bodyParser.urlencoded({ extended: true });
})();
exports.Permissions = function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    next();
};
