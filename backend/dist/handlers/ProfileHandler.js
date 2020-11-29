"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
var Schema_1 = require("../libs/Schema");
var Crypto_1 = require("../libs/Crypto");
var Profile = /** @class */ (function () {
    function Profile() {
        this.isRequested = false;
    }
    Profile.prototype.databaseConnector = function (databaseConnector) {
        this.database = databaseConnector;
    };
    Profile.prototype.__requestHandler = function (req) {
        var requestData = {
            GET: {
                method: this.__getUserData(req),
                code: 200,
            },
            POST: {
                method: this.__postDataHandler(req),
                code: 201,
            },
            OPTIONS: {
                method: this.__postDataHandler(req),
                code: 201,
            },
        };
        if (req.method === 'OPTIONS')
            this.isRequested = false;
        return requestData[req.method];
    };
    Profile.prototype.__getUserData = function (req) {
        if (Object.keys(req.query).length)
            return this.database.read(Schema_1.UserModel, { email: req.query.email });
        return this.database.read(Schema_1.UserModel);
    };
    /**
     * @TODO change req.body format
     */
    Profile.prototype.__postDataHandler = function (req) {
        if (!this.isRequested) {
            if (req.body.reqType === 'addMessage') {
                this.isRequested = true;
                return this.database.updateOne(Schema_1.UserModel, { email: req.body.serverData.email }, { $push: { messages: req.body.serverData.messages } });
            }
            if (req.body.reqType === 'deleteMessage') {
                this.__deleteUserConversations(req);
            }
        }
    };
    /**
     * @TODO change deleteMessageList format
     */
    Profile.prototype.__deleteUserConversations = function (req) {
        if (req.body.deleteMessageList)
            return this.database.updateOne(Schema_1.UserModel, { email: req.body.email }, { $pull: { messages: { _id: { $in: [req.body.deleteMessageList] } } } }, false);
        return this.database.updateOne(Schema_1.UserModel, { email: req.body.email }, { $unset: { messages: [] } }, false);
    };
    Profile.prototype.router = function () {
        var _this = this;
        return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, e_1;
            var _c;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 5, , 6]);
                        if (!(((_d = req.header('Content-Type')) === null || _d === void 0 ? void 0 : _d.split(' ')[0]) === 'multipart/form-data;')) return [3 /*break*/, 1];
                        this.isRequested = true;
                        this.register(req, res);
                        return [3 /*break*/, 4];
                    case 1:
                        if (!(req.body.reqType === 'login')) return [3 /*break*/, 2];
                        this.isRequested = true;
                        console.log(req.body.loginData);
                        this.database
                            .readPassword(Schema_1.UserModel, { email: req.body.loginData.email })
                            .then(function (data) {
                            data.forEach(function (datum) {
                                if (new Crypto_1.Crypto().decryption(datum.password.buffer) ===
                                    req.body.loginData.password) {
                                    res.status(200).json({
                                        status: 'ok',
                                    });
                                }
                            });
                        });
                        return [3 /*break*/, 4];
                    case 2:
                        _b = (_a = res.status(this.__requestHandler(req).code)).json;
                        _c = {};
                        return [4 /*yield*/, this.__requestHandler(req).method];
                    case 3:
                        _b.apply(_a, [(_c.data = _e.sent(),
                                _c)]);
                        _e.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _e.sent();
                        console.log(e_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
    };
    Profile.prototype.register = function (req, res) {
        var _this = this;
        var count;
        var userInfo = {
            userName: '',
            email: '',
            password: '',
            imagePath: '',
        };
        var form = require('formidable');
        form = new form.IncomingForm();
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            count = 0;
            file.path = __dirname + "/../../public/assets/profiles/" + file.name;
        });
        form.on('field', function (fieldName, fieldValue, file) {
            if (fieldName === 'userName') {
                userInfo.userName = JSON.parse(fieldValue);
            }
            else if (fieldName === 'email') {
                userInfo.email = JSON.parse(fieldValue);
            }
            else if (fieldName === 'password') {
                userInfo.password = JSON.parse(fieldValue);
            }
            else if (fieldName === 'imagePath') {
                userInfo.imagePath = JSON.parse(fieldValue);
            }
            if (userInfo.userName !== '' &&
                userInfo.email !== '' &&
                userInfo.password !== '' &&
                userInfo.imagePath !== '' &&
                count === 0) {
                var data = {
                    email: userInfo.email,
                    name: userInfo.userName,
                    password: new Crypto_1.Crypto().encryption(userInfo.password),
                    image: 'http://localhost:3000/assets/profiles/' + userInfo.imagePath,
                };
                _this.database.updateOne(Schema_1.UserModel, { email: data.email }, data);
                res.status(201).json({
                    status: 'ok',
                });
                count++;
            }
        });
        form.on('error', function (err) {
            console.log(err);
        });
        form.on('end', function () {
            count = 0;
            console.log('finished');
        });
    };
    return Profile;
}());
exports.Profile = Profile;
