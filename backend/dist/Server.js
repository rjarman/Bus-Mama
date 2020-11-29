"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Application_1 = require("./libs/Application");
var config_1 = require("./config");
var CommonMiddleware_1 = require("./middleware/CommonMiddleware");
var WatcherMiddleware_1 = require("./middleware/WatcherMiddleware");
var IndexHandler_1 = require("./handlers/IndexHandler");
var BusHandler_1 = require("./handlers/BusHandler");
var ProfileHandler_1 = require("./handlers/ProfileHandler");
var application = new Application_1.App({
    middleware: [CommonMiddleware_1.BodyParser, CommonMiddleware_1.BodyParserURLEncoded, CommonMiddleware_1.Permissions, WatcherMiddleware_1.Watcher],
    assetsPath: ['./../../public'],
    handlerModule: [
        { path: config_1.HANDLERS_PATH.root, handler: IndexHandler_1.Index },
        { path: config_1.HANDLERS_PATH.bus, handler: BusHandler_1.Bus },
        { path: config_1.HANDLERS_PATH.profile, handler: ProfileHandler_1.Profile },
    ],
});
application.listen();
