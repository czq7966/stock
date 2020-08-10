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
exports.ChdData = void 0;
var iconv = require("iconv-lite");
var Polyfills = require("../../polyfills");
var Option = {
    host: 'quotes.money.163.com',
    path: '/service/chddata.html?code={code}&start={start}&end={end}&fields=TCLOSE;HIGH;LOW;TOPEN;LCLOSE;CHG;PCHG;TURNOVER;VOTURNOVER;VATURNOVER;TCAP;MCAP'
};
var ChdData = /** @class */ (function () {
    function ChdData() {
    }
    ChdData._requestCodeData = function (code, start, end) {
        return __awaiter(this, void 0, void 0, function () {
            var startStr, endStr, options, body, strBuffer, _items, items_1, records_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startStr = start.format('yyyyMMdd');
                        endStr = end.format('yyyyMMdd');
                        options = {
                            host: Option.host,
                            path: Option.path.replace('{code}', code).replace('{start}', startStr).replace('{end}', endStr),
                        };
                        return [4 /*yield*/, Polyfills.requestBuffer(options)];
                    case 1:
                        body = _a.sent();
                        if (body) {
                            strBuffer = iconv.decode(body, 'GBK');
                            _items = strBuffer.split('\r\n');
                            items_1 = [];
                            _items = _items.slice(1);
                            _items.forEach(function (item) {
                                if (item && item.length > 0) {
                                    items_1.push(item);
                                }
                            });
                            records_1 = {};
                            items_1.forEach(function (item) {
                                item = item.split(',');
                                var record = {};
                                var i = 0;
                                record.date = item[i++];
                                record.code = (item[i++] || '').replace('\'', '');
                                record.name = item[i++] && null;
                                record.tclose = parseFloat(item[i++]);
                                record.high = parseFloat(item[i++]);
                                record.low = parseFloat(item[i++]);
                                record.topen = parseFloat(item[i++]);
                                record.lclose = parseFloat(item[i++]);
                                record.chg = parseFloat(item[i++]);
                                record.pchg = parseFloat(item[i++]);
                                record.turnover = parseFloat(item[i++]);
                                record.voturnover = parseFloat(item[i++]);
                                record.vaturnover = parseFloat(item[i++]);
                                record.tcap = parseFloat(item[i++]);
                                record.mcap = parseFloat(item[i++]);
                                records_1[record.date] = record;
                            });
                            return [2 /*return*/, records_1];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ChdData.requestCodeData = function (code, days, end) {
        return __awaiter(this, void 0, void 0, function () {
            var start, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        code = '0000000' + code;
                        code = code.substr(code.length - 7);
                        end = end || new Date();
                        start = new Date(new Date().setDate(end.getDate() - days));
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this._requestCodeData(code, start, end)];
                    case 3:
                        result = _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        console.log("get error: " + code + " " + error_1.message);
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, result];
                }
            });
        });
    };
    ChdData.updateChdData = function (chdDataDB, excCode, days, end) {
        return __awaiter(this, void 0, void 0, function () {
            var codes, keys, i, code, records, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        end = end || new Date();
                        codes = excCode == 'sh' ? chdDataDB.database.codes.getSHCodes() : chdDataDB.database.codes.getSZCodes();
                        keys = Object.keys(codes);
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < keys.length)) return [3 /*break*/, 4];
                        code = keys[i];
                        return [4 /*yield*/, this.requestCodeData(code, days, end)];
                    case 2:
                        records = _a.sent();
                        if (records) {
                            data = chdDataDB.getData(code);
                            // data = Object.assign(records);
                            data = records;
                            chdDataDB.setData(code, data);
                            console.log("got " + i + " / " + keys.length);
                        }
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, true];
                }
            });
        });
    };
    ChdData.update = function (chdDataDB, days, end) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        end = end || new Date();
                        return [4 /*yield*/, this.updateChdData(chdDataDB, 'sh', days, end)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChdData.averagePrice = function (chdDataDB, code) {
        return __awaiter(this, void 0, void 0, function () {
            var records, vaturnover, voturnover;
            return __generator(this, function (_a) {
                records = chdDataDB.getData(code);
                vaturnover = 0;
                voturnover = 0;
                Object.values(records).forEach(function (record) {
                    vaturnover += record.vaturnover;
                    voturnover += record.voturnover;
                });
                return [2 /*return*/, vaturnover / voturnover];
            });
        });
    };
    ChdData.averagePrices = function (chdDataDB, codes) {
        return __awaiter(this, void 0, void 0, function () {
            var results, shCodes;
            var _this = this;
            return __generator(this, function (_a) {
                results = {};
                if (!codes) {
                    shCodes = chdDataDB.database.codes.getSHCodes();
                    codes = Object.keys(shCodes);
                }
                codes.forEach(function (code) { return __awaiter(_this, void 0, void 0, function () {
                    var price;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.averagePrice(chdDataDB, code)];
                            case 1:
                                price = _a.sent();
                                results[code] = price;
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/, results];
            });
        });
    };
    ChdData.getCodePrices = function (chdDataDB, code) {
        return __awaiter(this, void 0, void 0, function () {
            var records, high, low, middle, average, vaturnover, voturnover;
            return __generator(this, function (_a) {
                records = chdDataDB.getData(code);
                high = 0, low = 0, middle = 0, average = 0;
                vaturnover = 0;
                voturnover = 0;
                Object.values(records).forEach(function (record) {
                    high = Math.max(high, record.high);
                    low = Math.min(low || 99999, record.low || 99999);
                    vaturnover += record.vaturnover;
                    voturnover += record.voturnover;
                });
                average = Math.round(vaturnover / voturnover * 100) / 100;
                middle = Math.round((high + low) / 2 * 100) / 100;
                return [2 /*return*/, { high: high, low: low, middle: middle, average: average }];
            });
        });
    };
    return ChdData;
}());
exports.ChdData = ChdData;
