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
    }
    Codes.prototype.destroy = function () {
    };
    Codes.prototype.getSHCodes = function () {
        return this.db.get('sh').value();
    };
    return Codes;
}());
exports.Codes = Codes;
