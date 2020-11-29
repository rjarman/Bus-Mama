"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Index = void 0;
var Index = /** @class */ (function () {
    function Index() {
    }
    Index.prototype.databaseConnector = function (databaseConnector) {
        this.database = databaseConnector;
    };
    Index.prototype.router = function () {
        return function (req, res) {
            res.status(200).json({
                message: "Welcome to Rafsun's Server!",
            });
        };
    };
    return Index;
}());
exports.Index = Index;
