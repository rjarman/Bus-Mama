"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = void 0;
var Socket = /** @class */ (function () {
    function Socket(server) {
        this.server = server;
        this.io = require('socket.io')(server);
        this.initEmit();
    }
    Socket.prototype.initEmit = function () {
        this.io.on('connection', function (socket) {
            console.log('a user is connected!');
            socket.on('connected person', function (data) {
                if (data !== '') {
                    console.log(data);
                }
            });
            socket.on('disconnected person', function (data) {
                console.log('disconnected: ', data);
            });
            socket.on('disconnect', function () {
                console.log('a user is disconnected!');
            });
        });
    };
    return Socket;
}());
exports.Socket = Socket;
