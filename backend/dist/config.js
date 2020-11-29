"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HANDLERS_PATH = exports.ENCRYPTION = exports.DATABASE = exports.SERVER = void 0;
exports.SERVER = {
    address: 'localhost',
    port: 3000,
};
exports.DATABASE = {
    url: 'mongodb://localhost:27017/Bus_Mama',
};
exports.ENCRYPTION = {
    algorithm: 'sha256',
    encodingBase: 'base64',
    cipherAlgorithm: 'aes-256-ctr',
    key: 'f8674ff5ab6d971df2abc627b90e60628be929ec',
};
exports.HANDLERS_PATH = {
    root: '/',
    bus: '/bus',
    profile: '/profile',
};
