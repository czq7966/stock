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
exports.Codes = void 0;
var Polyfills = require("../../polyfills");
var Codes = /** @class */ (function () {
    function Codes() {
    }
    Codes._requestCodeList = function (code, page) {
        return __awaiter(this, void 0, void 0, function () {
            var URL, KeyStr, codes, body, items, records_1, code_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        URL = 'http://app.finance.ifeng.com/list/stock.php?t={code}&f=chg_pct&o=desc&p={page}';
                        KeyStr = '<td><a href="http://finance.ifeng.com/app/hq/stock/';
                        page = page || 1;
                        codes = {};
                        return [4 /*yield*/, Polyfills.requestPage({ url: URL.replace('{code}', code).replace('{page}', page) })];
                    case 1:
                        body = _a.sent();
                        if (body) {
                            items = body.split('\r\n');
                            records_1 = [];
                            items.forEach(function (item) {
                                if (item.indexOf(KeyStr) >= 0) {
                                    var preFix = 'target="_blank">';
                                    var subFix = '</a></td>';
                                    var startIndex = item.indexOf(preFix) + preFix.length;
                                    var endIndex = item.indexOf(subFix);
                                    records_1.push(item.substring(startIndex, endIndex));
                                }
                            });
                            records_1.forEach(function (item) {
                                if (parseInt(item) > 0) {
                                    code_1 = item;
                                    codes[code_1] = '';
                                }
                                else {
                                    codes[code_1] = ''; //item
                                }
                            });
                        }
                        if (Object.keys(codes).length > 0)
                            return [2 /*return*/, codes];
                        else
                            return [2 /*return*/, null];
                        return [2 /*return*/];
                }
            });
        });
    };
    Codes.requestCodeList = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var codes, page, _codes, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        codes = {};
                        page = 1;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this._requestCodeList(code, page)];
                    case 3:
                        _codes = _a.sent();
                        if (_codes && Object.keys(_codes).length > 0) {
                            codes = Object.assign(codes, _codes);
                            page++;
                        }
                        else {
                            return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.log("get page " + page + " error: " + error_1.message);
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 1];
                    case 6:
                        console.log(Object.keys(codes).length);
                        return [2 /*return*/, codes];
                }
            });
        });
    };
    Codes.updateSZCodes = function (codesDB) {
        return __awaiter(this, void 0, void 0, function () {
            var codes, _codes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        codes = codesDB.getSZCodes();
                        return [4 /*yield*/, this.requestCodeList('sa')];
                    case 1:
                        _codes = _a.sent();
                        codes = Object.assign(codes, _codes);
                        if (codes && Object.keys(codes).length > 0) {
                            codesDB.setSZCodes(codes);
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    return Codes;
}());
exports.Codes = Codes;
