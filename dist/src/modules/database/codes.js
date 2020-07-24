"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Codes = void 0;
// const Lowdb = require('lowdb');
var Lowdb = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var Codes = /** @class */ (function () {
    function Codes() {
        this.filename = './database/codes.json';
        this.db = Lowdb(new FileSync(this.filename));
        this.db.defaults({ sh: {}, sz: {} }).write();
    }
    Codes.prototype.destroy = function () {
    };
    Codes.prototype.getSHCodes = function () {
        return this.db.get('sh').value();
    };
    Codes.prototype.getSZCodes = function () {
        return this.db.get('sz').value();
    };
    Codes.prototype.setSHCodes = function (codes) {
        this.db.set('sh', codes).write();
    };
    Codes.prototype.setSZCodes = function (codes) {
        this.db.set('sz', codes).write();
    };
    return Codes;
}());
exports.Codes = Codes;
