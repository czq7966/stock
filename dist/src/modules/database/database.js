"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.Database = void 0;
var codes_1 = require("./codes");
var transhis_1 = require("./transhis");
var proxys_1 = require("./proxys");
var chddata_1 = require("./chddata");
var incomes_1 = require("./incomes");
var Database = /** @class */ (function () {
    function Database() {
        this.codes = new codes_1.Codes(this);
        this.transhis = new transhis_1.TransHis(this);
        this.proxys = new proxys_1.Proxys(this);
        this.chddata = new chddata_1.ChdData(this);
        this.incomes = new incomes_1.Incomes(this);
    }
    Database.prototype.destroy = function () {
        this.codes.destroy();
        this.transhis.destroy();
        this.proxys.destroy();
        this.chddata.destroy();
        this.incomes.destroy();
        this.codes = null;
        this.transhis = null;
        this.proxys = null;
        this.incomes = null;
        this.chddata = null;
    };
    return Database;
}());
exports.Database = Database;
exports.database = new Database();
