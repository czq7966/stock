"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.Database = void 0;
var codes_1 = require("./codes");
var transhis_1 = require("./transhis");
var Database = /** @class */ (function () {
    function Database() {
        this.codes = new codes_1.Codes();
        this.transhis = new transhis_1.TransHis();
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
