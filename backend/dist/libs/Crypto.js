"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypto = void 0;
var crypto = require("crypto");
var config_1 = require("../config");
var Crypto = /** @class */ (function () {
    function Crypto() {
        this.__cipherAlgorithm = config_1.ENCRYPTION.cipherAlgorithm;
        this.__generatedHash = crypto
            .createHash(config_1.ENCRYPTION.algorithm)
            .update(String(config_1.ENCRYPTION.key))
            .digest("base64")
            .substr(0, 32);
    }
    Crypto.prototype.encryption = function (data) {
        var tempData = Buffer.from(data, 'binary');
        var initializationVector = crypto.randomBytes(16);
        var cipher = crypto.createCipheriv(this.__cipherAlgorithm, this.__generatedHash, initializationVector);
        var result = Buffer.concat([
            initializationVector,
            cipher.update(tempData),
            cipher.final(),
        ]);
        return result;
    };
    Crypto.prototype.decryption = function (data) {
        var initializationVector = data.slice(0, 16);
        var tempData = data.slice(16);
        var decipher = crypto.createDecipheriv(this.__cipherAlgorithm, this.__generatedHash, initializationVector);
        var result = Buffer.concat([decipher.update(tempData), decipher.final()]);
        return result.toString('binary');
    };
    return Crypto;
}());
exports.Crypto = Crypto;
