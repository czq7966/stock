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
exports.TransHis = void 0;
var Lowdb = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var Services = require("../../services");
var path = require("path");
var fs = require("fs");
var polyfills = require("../../polyfills");
var TransHis = /** @class */ (function () {
    function TransHis(database) {
        this.database = database;
        this.init();
    }
    TransHis.prototype.destroy = function () {
    };
    TransHis.prototype.init = function () {
        this.dbs = {};
    };
    TransHis.prototype.getDBPath = function () {
        return path.resolve(__dirname, '../../../../database');
    };
    TransHis.prototype.getDBDataPath = function () {
        return path.resolve(this.getDBPath(), 'data');
    };
    TransHis.prototype.getChdDataKey = function () {
        return 'chddata';
    };
    TransHis.prototype.getTransHisKey = function (code) {
        return 'transhis';
    };
    TransHis.prototype.getDateKey = function (date) {
        return date.format('yyyyMMdd');
    };
    TransHis.prototype.getTransHisFilename = function (code, date) {
        return path.resolve(this.getDBDataPath(), code + "/" + this.getTransHisKey() + "/" + this.getDateKey(date) + ".json");
    };
    TransHis.prototype.getChdDataFilename = function (code) {
        return path.resolve(this.getDBDataPath(), code + "/" + this.getChdDataKey() + "/" + code + ".json");
    };
    TransHis.prototype.getTransHisDB = function (code, date) {
        var filename = this.getTransHisFilename(code, date);
        polyfills.mkdirsSync(path.dirname(filename));
        var db = this.dbs[filename];
        if (!db) {
            db = Lowdb(new FileSync(filename));
            db.defaults({}).write();
            this.dbs[filename] = db;
        }
        return db;
    };
    TransHis.prototype.getChdDataDB = function (code) {
        var filename = this.getChdDataFilename(code);
        polyfills.mkdirsSync(path.dirname(filename));
        var db = this.dbs[filename];
        if (!db) {
            db = Lowdb(new FileSync(filename));
            db.defaults({}).write();
            this.dbs[filename] = db;
        }
        return db;
    };
    TransHis.prototype.existTransHisDB = function (code, date) {
        var filename = this.getTransHisFilename(code, date);
        return fs.existsSync(filename);
    };
    TransHis.prototype.existChdDataDB = function (code) {
        var filename = this.getChdDataFilename(code);
        return fs.existsSync(filename);
    };
    TransHis.prototype.update = function (code, date, records) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Services.Database.TransHis.update(this, code, date, records)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return TransHis;
}());
exports.TransHis = TransHis;
