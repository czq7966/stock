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
var http = require("http");
var iconv = require("iconv-lite");
var BufferHelper = require("bufferhelper");
var GlobalTunnel = require("global-tunnel-ng");
var request = require("request");
var Options = {
    host: 'market.finance.sina.com.cn',
    path: '/transHis.php?symbol={symbol}&date={date}&page={page}'
};
var TransHis = /** @class */ (function () {
    function TransHis() {
    }
    TransHis._onRequestEnd = function (items) {
        var result = [];
        if (items.length > 1) {
            var count = items.length;
            for (var i = count - 1; i >= 0; i--) {
                var item = items[i] || '';
                if (item.indexOf("<tr ><th>") >= 0 && item.indexOf("</th></tr>") > 0) {
                }
                else {
                    items.splice(i, 1);
                }
            }
            if (items.length > 0) {
                items = items[0].split('</th></tr>');
                result = this._onRequestData(items);
            }
        }
        return result;
    };
    TransHis._onRequestData = function (items) {
        var records = [];
        items.forEach(function (item) {
            var itemArr = item.replace(/<tr ><th>/g, '\r\n').replace(/<\/td><td>/g, '\r\n').replace(/<\/th><td>/g, '\r\n').replace(/<\/td><th>/g, '\r\n').split('\r\n');
            var i = 1;
            var record = {
                time: itemArr[i++],
                price: parseFloat(itemArr[i++]) || 0,
                change: parseFloat(itemArr[i++]) || 0,
                voturnover: parseFloat(itemArr[i++]) || 0,
                vaturnover: parseFloat((itemArr[i++] || '').replace(',', '')) || 0
            };
            if (record.time) {
                records.push(record);
            }
        });
        return records;
    };
    TransHis._getTransHis1 = function (symbol, date, page, proxyHost, proxyPort) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (proxyHost && proxyPort) {
                            GlobalTunnel.initialize({ host: proxyHost, port: proxyPort });
                        }
                        page = page || 1;
                        var dateStr = date.format('yyyy-MM-dd');
                        var options = {
                            host: Options.host,
                            path: Options.path.replace('{symbol}', symbol).replace('{date}', dateStr).replace('{page}', page)
                        };
                        var onData = function (items) {
                            var records = [];
                            items.forEach(function (item) {
                                var itemArr = item.replace(/<tr ><th>/g, '\r\n').replace(/<\/td><td>/g, '\r\n').replace(/<\/th><td>/g, '\r\n').replace(/<\/td><th>/g, '\r\n').split('\r\n');
                                var i = 1;
                                var record = {
                                    time: itemArr[i++],
                                    price: parseFloat(itemArr[i++]) || 0,
                                    change: parseFloat(itemArr[i++]) || 0,
                                    voturnover: parseFloat(itemArr[i++]) || 0,
                                    vaturnover: parseFloat((itemArr[i++] || '').replace(',', '')) || 0
                                };
                                if (record.time) {
                                    records.push(record);
                                }
                            });
                            return records;
                        };
                        var onEnd = function (items) {
                            if (items.length > 1) {
                                var count = items.length;
                                for (var i = count - 1; i >= 0; i--) {
                                    var item = items[i] || '';
                                    if (item.indexOf("<tr ><th>") >= 0 && item.indexOf("</th></tr>") > 0) {
                                    }
                                    else {
                                        items.splice(i, 1);
                                    }
                                }
                                if (items.length > 0) {
                                    items = items[0].split('</th></tr>');
                                    return onData(items);
                                }
                            }
                            else {
                                return [];
                            }
                        };
                        var callback = function (response) {
                            var bufferHelper = new BufferHelper();
                            response.on('data', function (chunk) {
                                bufferHelper.concat(chunk);
                            });
                            response.on('end', function () {
                                var strBuffer = iconv.decode(bufferHelper.toBuffer(), 'GBK');
                                if (strBuffer.indexOf('<a href="downxls.php?date=') > 0) {
                                    var items = strBuffer.split('\r\n');
                                    var records = onEnd(items);
                                    if (proxyHost && proxyPort)
                                        GlobalTunnel.end();
                                    resolve(records);
                                }
                                else {
                                    reject(new Error('error page'));
                                }
                            });
                            response.on('error', function (err) {
                                console.error('error: ', err.message);
                                if (proxyHost && proxyPort)
                                    GlobalTunnel.end();
                                reject(err);
                            });
                        };
                        var request = http.request(options, callback);
                        request.on('error', function (err) {
                            if (proxyHost && proxyPort)
                                GlobalTunnel.end();
                            reject(err);
                        });
                        request.end();
                    })];
            });
        });
    };
    TransHis._getTransHis = function (symbol, date, page, proxyHost, proxyPort) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        page = page || 1;
                        var dateStr = date.format('yyyy-MM-dd');
                        var options = {
                            'url': 'http://' + Options.host + Options.path.replace('{symbol}', symbol).replace('{date}', dateStr).replace('{page}', page),
                            'method': "GET",
                            'timeout': 10 * 1000
                        };
                        if (proxyHost && proxyPort)
                            options['proxy'] = "http://" + proxyHost + ":" + proxyPort;
                        request(options, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var strBuffer = body;
                                if (strBuffer.indexOf('<a href="downxls.php?date=') > 0) {
                                    var items = strBuffer.split('\r\n');
                                    var records = _this._onRequestEnd(items);
                                    resolve(records);
                                }
                                else {
                                    reject(new Error('error page'));
                                }
                            }
                            else {
                                if (!error && response) {
                                    reject(new Error(response.statusCode));
                                }
                                else {
                                    reject(error);
                                }
                            }
                        });
                    })];
            });
        });
    };
    TransHis.getTransHis = function (transHis, code, date, page) {
        return __awaiter(this, void 0, void 0, function () {
            var symbol, proxys, proxyHosts, proxysCount, records, _records, startTime, index, host, port, error_1, endTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page = page || 1;
                        symbol = (parseInt(code) >= 600000 && parseInt(code) < 700000 ? 'sh' : 'sz') + code;
                        proxys = transHis.database.proxys.getValids();
                        proxyHosts = Object.keys(proxys);
                        proxysCount = proxyHosts.length;
                        records = [];
                        _records = [];
                        startTime = new Date();
                        console.log("getting: " + code + " " + date.format('yyyy-MM-dd'));
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 6];
                        index = Math.floor(Math.random() * proxysCount);
                        host = proxyHosts[index];
                        port = proxys[host];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this._getTransHis(symbol, date, page, host, port)];
                    case 3:
                        _records = _a.sent();
                        if (_records && _records.length > 0) {
                            records = records.concat(_records);
                            console.log("got page " + page + " of " + code + " " + date.format('yyyy-MM-dd'));
                            // await Polyfills.sleep(1000);
                            page++;
                        }
                        else {
                            return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error("got " + code + " error: " + error_1.message);
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 1];
                    case 6:
                        endTime = new Date();
                        console.log("end get: " + code + " " + (endTime - startTime) / 1000 + " Secs");
                        return [2 /*return*/, records];
                }
            });
        });
    };
    TransHis.update = function (transHis, code, date) {
        return __awaiter(this, void 0, void 0, function () {
            var records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTransHis(transHis, code, date)];
                    case 1:
                        records = _a.sent();
                        if (!(records && records.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, transHis.database.transhis.update(code, date, records)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        console.error('222222222', code + ':' + date.format('yyyy-MM-dd') + ' records empty');
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TransHis.getPrices = function (transHis, code) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    TransHis.getDateRecords = function (transHis, code, date) {
        return __awaiter(this, void 0, void 0, function () {
            var prices, dateKey, db;
            return __generator(this, function (_a) {
                dateKey = date.format('yyyy-MM-dd');
                db = transHis.database.transhis.existTransHisDB(code, date) ? transHis.database.transhis.getTransHisDB(code, date) : null;
                if (db) {
                    prices = db.get("transhis").value();
                }
                return [2 /*return*/, prices];
            });
        });
    };
    TransHis.checkDateRecords = function (transHis, prices) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //Todo        
                return [2 /*return*/, true];
            });
        });
    };
    TransHis.getAndCheckDateRecords = function (transHis, code, date) {
        return __awaiter(this, void 0, void 0, function () {
            var prices;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDateRecords(transHis, code, date)];
                    case 1:
                        prices = _a.sent();
                        if (prices && this.checkDateRecords(transHis, prices)) {
                            return [2 /*return*/, prices];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TransHis.trimPrices = function (transHis, records) {
        return __awaiter(this, void 0, void 0, function () {
            var prices;
            return __generator(this, function (_a) {
                prices = [];
                records.forEach(function (record) {
                    prices.push(record.price);
                });
                return [2 /*return*/, prices];
            });
        });
    };
    TransHis.reversePrices = function (transHis, prices) {
        return __awaiter(this, void 0, void 0, function () {
            var temp, i;
            return __generator(this, function (_a) {
                temp = [];
                for (i = prices.length - 1; i >= 0; i--) {
                    temp.push(prices[i]);
                }
                return [2 /*return*/, temp];
            });
        });
    };
    TransHis.getDatePrices = function (transHis, code, date, reverse) {
        return __awaiter(this, void 0, void 0, function () {
            var records, prices, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getAndCheckDateRecords(transHis, code, date)];
                    case 1:
                        records = _b.sent();
                        return [4 /*yield*/, this.trimPrices(transHis, records)];
                    case 2:
                        prices = _b.sent();
                        if (!reverse) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.reversePrices(transHis, prices)];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = prices;
                        _b.label = 5;
                    case 5:
                        prices = _a;
                        return [2 /*return*/, prices];
                }
            });
        });
    };
    TransHis.getTrimDatesPrices = function (transHis, code, days, end) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return TransHis;
}());
exports.TransHis = TransHis;
