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
exports.Proxys = void 0;
var http = require("http");
var iconv = require("iconv-lite");
var BufferHelper = require("bufferhelper");
var GlobalTunnel = require("global-tunnel-ng");
var request = require("request");
var Polyfills = require("../../polyfills");
var Proxys = /** @class */ (function () {
    function Proxys() {
    }
    Proxys.checkProxy1 = function (host, port) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        GlobalTunnel.initialize({ host: host, port: port });
                        var options = {
                            host: "www.baidu.com"
                        };
                        var callback = function (response) {
                            var bufferHelper = new BufferHelper();
                            response.on('data', function (chunk) {
                                bufferHelper.concat(chunk);
                            });
                            response.on('end', function () {
                                var strBuffer = iconv.decode(bufferHelper.toBuffer(), 'GBK');
                                if (strBuffer) {
                                    GlobalTunnel.end();
                                    resolve(true);
                                }
                                else {
                                    GlobalTunnel.end();
                                    resolve(false);
                                }
                            });
                            response.on('error', function (err) {
                                GlobalTunnel.end();
                                reject(err);
                            });
                            response.on('close', function () {
                                // console.log('response close')
                            });
                        };
                        var request = http.request(options, callback);
                        request.on('error', function (err) {
                            GlobalTunnel.end();
                            reject(err);
                        });
                        request.end(function () { });
                    })];
            });
        });
    };
    Proxys.checkProxy = function (host, port) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        request({
                            'url': 'http://www.baidu.com',
                            'method': "GET",
                            'proxy': "http://" + host + ":" + port
                        }, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                resolve(true);
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
    Proxys.checkValid = function (proxys) {
        return __awaiter(this, void 0, void 0, function () {
            var count, checkIndex, host, port, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        count = this.CheckProxyHosts.length;
                        _a.label = 1;
                    case 1:
                        if (!(count > 0 && this.CheckIndex < count)) return [3 /*break*/, 6];
                        this.CheckIndex++;
                        checkIndex = this.CheckIndex;
                        host = this.CheckProxyHosts[checkIndex];
                        port = this.CheckProxys[host];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.checkProxy(host, port)];
                    case 3:
                        _a.sent();
                        this.FinishCount++;
                        this.ProxyValids[host] = port;
                        proxys.addValid(host, port);
                        // proxys.db.set(`proxys.${host}`, port).write();
                        console.log("-----------------------------" + checkIndex + " / " + count + "----- " + host + " : " + port);
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        this.FinishCount++;
                        return [3 /*break*/, 5];
                    case 5:
                        console.log(Object.keys(this.ProxyValids).length + " / " + this.FinishCount + " / " + this.CheckProxyHosts.length);
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, this.ProxyValids];
                }
            });
        });
    };
    Proxys.checkValids = function (proxys, threadCount) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, i, promise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.FinishCount = 0;
                        this.ProxyValids = {};
                        this.CheckIndex = -1;
                        this.CheckProxys = proxys.db.get("proxys").value();
                        this.CheckProxyHosts = Object.keys(this.CheckProxys);
                        threadCount = threadCount || 200;
                        promises = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < threadCount)) return [3 /*break*/, 4];
                        promise = this.checkValid(proxys);
                        promises.push(promise);
                        return [4 /*yield*/, Polyfills.sleep(200)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, Promise.all(promises)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, this.ProxyValids];
                }
            });
        });
    };
    Proxys._collectProxyFromKDL = function (proxys, url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        request({
                            'url': url,
                            'method': "GET"
                        }, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var hosts = {};
                                var lines = body.split('\n');
                                var hostPrefix = '<td data-title="IP">';
                                var portPrefix = '<td data-title="PORT">';
                                var hostSubfix = '</td>';
                                var portSubfix = '</td>';
                                for (var i = 0; i < lines.length; i++) {
                                    var hostLine = lines[i] || '';
                                    var portLine = lines[i + 1] || '';
                                    var hostIndex = hostLine.indexOf(hostPrefix);
                                    var portIndex = portLine.indexOf(portPrefix);
                                    if (hostIndex >= 0 && portIndex >= 0) {
                                        var hostTDIndex = hostLine.indexOf(hostSubfix, hostIndex);
                                        var portTDIndex = portLine.indexOf(portSubfix, portIndex);
                                        var host = hostLine.substr(hostIndex + hostPrefix.length, hostTDIndex - hostIndex - hostPrefix.length);
                                        var port = portLine.substr(portIndex + portPrefix.length, portTDIndex - portIndex - portPrefix.length);
                                        proxys.addProxy(host, parseInt(port));
                                        hosts[host] = port;
                                    }
                                }
                                // <td data-title="IP">
                                resolve(hosts);
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
    Proxys.collectProxyFromKDL = function (proxys) {
        return __awaiter(this, void 0, void 0, function () {
            var URL, startCount, endCount, count, page, url, hosts, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        URL = "http://www.kuaidaili.com/free/inha/{page}/";
                        startCount = 200;
                        endCount = 2000;
                        count = 0;
                        page = startCount;
                        _a.label = 1;
                    case 1:
                        if (!(page <= endCount)) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        url = URL.replace('{page}', page);
                        return [4 /*yield*/, this._collectProxyFromKDL(proxys, url)];
                    case 3:
                        hosts = _a.sent();
                        count = count + Object.keys(hosts).length;
                        console.log(count + " / " + page + " / " + endCount);
                        // Polyfills.sleep(1000);
                        page++;
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.error(error_2.message);
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Proxys.CheckIndex = -1;
    Proxys.FinishCount = 0;
    Proxys.ProxyValids = {};
    return Proxys;
}());
exports.Proxys = Proxys;
