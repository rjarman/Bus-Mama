"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
var mongoose = require("mongoose");
var config_1 = require("../config");
var Database = /** @class */ (function () {
    function Database() {
        /**
         * This class handles all the database connections!
         */
        this.__databaseURL = config_1.DATABASE.url;
        mongoose.connect(this.__databaseURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        this.__database = mongoose.connection;
        this.__dbError();
    }
    Database.prototype.__dbError = function () {
        this.__database.on('open', function () {
            console.log('Successfully connected to MongoDB!');
        });
        this.__database.on('error', console.error.bind(console, 'MongoDB connection error:'));
    };
    Database.prototype.__errorHandler = function (message, err) {
        /**
         * @param message is string of details about errors
         * @param err callback error
         */
        console.log(message + "\n" + err);
    };
    Database.prototype.create = function (model, data) {
        var _this = this;
        /**
         * @param model is mongoose schema model
         * @param data
         * @return
         */
        return model.create(data, function (err) {
            if (err)
                _this.__errorHandler('create() cannot add data!\n', err);
            else
                console.log('Create successfully!');
        });
    };
    Database.prototype.updateOne = function (model, filter, updateOn, upsert) {
        var _this = this;
        if (upsert === void 0) { upsert = true; }
        /**
             * @param model is mongoose schema model
             * @param filter
             * @param updateOn where to update, takes mongodb query
             * @param upsert is optional default value true
             * @return { n: 1|0, nModified: 0, ok: 1|0 } as Promise
    
             */
        return model.updateOne(filter, updateOn, { upsert: upsert }, function (err) {
            if (err)
                _this.__errorHandler('updateOne() cannot add data!\n', err);
        });
    };
    Database.prototype.read = function (model, filter) {
        var _this = this;
        if (filter === void 0) { filter = {}; }
        /**
         * @param model is mongoose schema model
         * @param filter, default is {}
         * @return Promise of all the filtered schema model data
         */
        return model.find(filter, { password: 0 }, function (err, res) {
            if (err)
                _this.__errorHandler('readByFilter() cannot read data!\n', err);
        });
    };
    Database.prototype.readPassword = function (model, filter) {
        var _this = this;
        if (filter === void 0) { filter = {}; }
        /**
         * @param model is mongoose schema model
         * @param filter, default is {}
         * @return Promise of all the filtered schema model data
         */
        return model.find(filter, function (err, res) {
            if (err)
                _this.__errorHandler('readByFilter() cannot read data!\n', err);
        }).exec();
    };
    return Database;
}());
exports.Database = Database;
