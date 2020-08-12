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
var Modules = require("../../modules");
var TransHis = /** @class */ (function () {
    function TransHis() {
    }
    TransHis.update = function (transHis, code, date, records) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                db = transHis.getTransHisDB(code, date);
                db.set(transHis.getTransHisKey(code), records).write();
                return [2 /*return*/];
            });
        });
    };
    TransHis.calCodeInvestParams = function (transHis, code, investment) {
        return __awaiter(this, void 0, void 0, function () {
            var incomes, prices, handles, volume, value, income, getCloserIncome, _baseRate, currIncome, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        incomes = [];
                        investment.handleVolume = investment.handleVolume || Modules.Dts.SHHandleVolume;
                        return [4 /*yield*/, transHis.database.chddata.getCodePrices(code)];
                    case 1:
                        prices = _a.sent();
                        handles = 0;
                        if (!prices || !prices.high)
                            return [2 /*return*/];
                        while (true) {
                            handles++;
                            volume = handles * investment.handleVolume;
                            value = volume * prices.average;
                            if (value > investment.capital.max)
                                break;
                            income = { min: investment.income.min / value,
                                max: investment.income.max / value,
                                mid: (investment.income.min + investment.income.max) / 2 / value,
                                vol: volume,
                                val: value };
                            incomes.push(income);
                        }
                        getCloserIncome = function (baseRate, income1, income2) {
                            var result;
                            income2 = income2 || income1;
                            var rateMax1 = Math.abs(income1.max - baseRate);
                            var rateMid1 = Math.abs(income1.mid - baseRate);
                            var rateMin1 = Math.abs(income1.min - baseRate);
                            var rateMax2 = Math.abs(income2.max - baseRate);
                            var rateMid2 = Math.abs(income2.mid - baseRate);
                            var rateMin2 = Math.abs(income2.min - baseRate);
                            var rate1 = Math.min(rateMax1, rateMid1, rateMin1);
                            var rate2 = Math.min(rateMax2, rateMid2, rateMin2);
                            if (rate1 <= rate2) {
                                result = Object.assign({}, income1);
                                result.curr = rateMax1 < rateMid1 ? income1.max : rateMid1 < rateMin1 ? income1.mid : income1.min;
                            }
                            else {
                                result = Object.assign({}, income2);
                                result.curr = rateMax2 < rateMid2 ? income2.max : rateMid2 < rateMin2 ? income2.mid : income2.min;
                            }
                            return result;
                        };
                        _baseRate = (investment.income.min + investment.income.max) / (investment.capital.min + investment.capital.max);
                        currIncome = null;
                        incomes.forEach(function (income) {
                            currIncome = getCloserIncome(_baseRate, income, currIncome);
                        });
                        if (currIncome) {
                            result = {
                                prices: { high: prices.high, low: prices.low, average: prices.average },
                                step: { price: prices.average * currIncome.curr, volume: currIncome.vol }
                            };
                            return [2 /*return*/, result];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TransHis.getCodePricePoints = function (transHis, code, investParms) {
        var low = investParms.prices.average;
        while (low > investParms.prices.low) {
            low = low - investParms.step.price;
        }
        var point = low + investParms.step.price;
        point = Math.round(point * 100) / 100;
        var result = [];
        while (point <= investParms.prices.high) {
            result.push(point);
            point = point + investParms.step.price;
            point = Math.round(point * 100) / 100;
        }
        return result;
    };
    TransHis.initCodePriceHoldPoints = function (transHis, code, investParms, currPrice) {
        var result = {};
        var points = this.getCodePricePoints(transHis, code, investParms).sort(function (a, b) { return a - b; });
        for (var i = 0; i < points.length; i++) {
            var point = Math.round(points[i] * 100.0) / 100.0;
            result[point] = (i < points.length - 1) && (point >= currPrice) && false;
        }
        return result;
    };
    TransHis.getCodeSalePoints = function (transHis, code, investParams) {
        var low = investParams.prices.average;
        while (low > investParams.prices.low) {
            low = low - investParams.step.price;
        }
        var point = low + investParams.step.price;
        var result = [];
        while (point <= investParams.prices.high) {
            result.push(point);
            point = point + investParams.step.price;
        }
        return result;
    };
    TransHis.tryCodeBuyPricePoint = function (transHis, code, holdPoints, currPrice) {
        var result = [];
        var points = Object.keys(holdPoints).sort(function (a, b) { return a - b; });
        for (var i = 0; i < points.length - 1; i++) {
            var point = points[i];
            var hold = holdPoints[point];
            if (!hold && point >= currPrice) {
                holdPoints[point] = true;
                result.push(point);
            }
        }
        return result;
    };
    TransHis.tryCodeSalePricePoint = function (transHis, code, holdPoints, currPrice) {
        var result = [];
        var points = Object.keys(holdPoints).sort(function (a, b) { return a - b; });
        for (var i = 0; i < points.length - 1; i++) {
            var point = points[i];
            var nextPoint = points[i + 1];
            var hold = holdPoints[point];
            if (hold && currPrice >= nextPoint) {
                holdPoints[point] = false;
                result.push(point);
                // console.log('1111', point, nextPoint, currPrice)
            }
        }
        return result;
    };
    TransHis.calCodeInvestmentReturn = function (transHis, code, investParams) {
        return __awaiter(this, void 0, void 0, function () {
            var result, records, dates, currPrice, holdPoints, buyCount, saleCount, i, date, db, details, j, detail, buys, sales, income, points;
            return __generator(this, function (_a) {
                records = transHis.database.chddata.getData(code);
                dates = Object.keys(records).reverse();
                currPrice = 0;
                holdPoints = null;
                buyCount = 0;
                saleCount = 0;
                for (i = 0; i < dates.length; i++) {
                    date = dates[i];
                    if (transHis.existTransHisDB(code, new Date(date))) {
                        db = transHis.getTransHisDB(code, new Date(date));
                        details = db.get("transhis").value().reverse();
                        for (j = 0; j < details.length; j++) {
                            detail = details[j];
                            currPrice = detail.price;
                            holdPoints = holdPoints || this.initCodePriceHoldPoints(transHis, code, investParams, currPrice);
                            buys = this.tryCodeBuyPricePoint(transHis, code, holdPoints, currPrice);
                            sales = this.tryCodeSalePricePoint(transHis, code, holdPoints, currPrice);
                            buyCount = buyCount + buys.length;
                            saleCount = saleCount + sales.length;
                            if (buys.length > 0 || sales.length > 0) {
                                // console.log(`buyCount: ${buyCount} , saleCount: ${saleCount} `)
                            }
                        }
                        // console.log(`buyCount: ${buyCount} , saleCount: ${saleCount} `);
                    }
                }
                ;
                income = {};
                income.buyCount = buyCount;
                income.saleCount = saleCount;
                points = Object.keys(holdPoints).sort(function (a, b) { return a - b; });
                points.splice(points.length - 1);
                points.forEach(function (point) {
                    income.capital = (income.capital || 0) + point * investParams.step.volume;
                });
                income.income = income.saleCount * investParams.step.price * investParams.step.volume;
                income.rate = income.income * 100 / income.capital;
                result = {
                    code: code,
                    params: investParams,
                    points: holdPoints,
                    income: income
                };
                return [2 /*return*/, result];
            });
        });
    };
    return TransHis;
}());
exports.TransHis = TransHis;
