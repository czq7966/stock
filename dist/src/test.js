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
require("./polyfills");
var Modules = require("./modules");
var Services = require("./services");
var transHis = new Modules.TransHis();
var codes = transHis.database.codes.getSHCodes();
function Delay(timeout) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, timeout);
    });
}
codes = {
    "603993": "",
};
var keys = Object.keys(codes);
var StartNow = new Date(new Date().setDate(new Date().getDate() - 365));
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var index, code;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!(index < keys.length)) return [3 /*break*/, 4];
                    code = keys[index];
                    return [4 /*yield*/, transHis.update(code, StartNow)];
                case 2:
                    _a.sent();
                    console.log('1111111: ' + code);
                    _a.label = 3;
                case 3:
                    index++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// start();
function test() {
    return __awaiter(this, void 0, void 0, function () {
        var proxys, hosts, valids;
        var _this = this;
        return __generator(this, function (_a) {
            proxys = Modules.Database.database.proxys.getValids();
            hosts = Object.keys(proxys);
            valids = {};
            hosts.forEach(function (host) { return __awaiter(_this, void 0, void 0, function () {
                var port, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            port = proxys[host];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Services.Database.Proxys.checkProxy(host, port)];
                        case 2:
                            result = _a.sent();
                            if (result) {
                                valids[host] = port;
                                console.log("---------------succeed " + host + " " + port);
                            }
                            else {
                                Modules.Database.database.proxys.delValid(host);
                                console.log("============= delete " + host + " " + port);
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            Modules.Database.database.proxys.delValid(host);
                            console.error("error " + host + " " + port + " " + error_1.message);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/, valids];
        });
    });
}
function test2() {
    return __awaiter(this, void 0, void 0, function () {
        var valids;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, test()];
                case 1:
                    valids = _a.sent();
                    console.log(valids);
                    return [2 /*return*/];
            }
        });
    });
}
// test2()
// Services.Database.Proxys.collectProxyFromK89IP(Modules.Database.database.proxys)
Services.Database.Codes.updateSZCodes(Modules.Database.database.codes);
// test();
// Object.keys(codes).forEach(async (code) => {
//     await transHis.update(code, new Date());
//     await Delay(30 * 1000)
//     console.log('1111111: ' + code);
// })
// transHis.update('603993', new Date());
// Modules.Database.database.transhis.update('123456', new Date(), [])
