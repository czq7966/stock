"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.Database = void 0;
var codes_1 = require("./codes");
var transhis_1 = require("./transhis");
var proxys_1 = require("./proxys");
var Database = /** @class */ (function () {
    function Database() {
        this.codes = new codes_1.Codes();
        this.transhis = new transhis_1.TransHis();
        this.proxys = new proxys_1.Proxys();
    }
    Database.prototype.destroy = function () {
        this.codes.destroy();
        this.transhis.destroy();
        this.codes = null;
        this.transhis = null;
    };
    return Database;
}());
exports.Database = Database;
exports.database = new Database();
// export { database };
