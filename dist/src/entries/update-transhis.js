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
var Modules = require("../modules");
var transHis = new Modules.TransHis();
// let codes = transHis.database.codes.getSHCodes()
// // codes = {
// //     "60000":""
// // }
var Progress = /** @class */ (function () {
    function Progress() {
        this.Codes = Object.keys(Modules.Database.database.codes.getSHCodes());
        this.CodesIndex = 0;
        this.Dates = {};
    }
    Progress.prototype.destroy = function () {
    };
    Progress.prototype.getCodeDates = function (code) {
        var dates = {};
        var chddata = Modules.Database.database.chddata.getData(code);
        Object.keys(chddata).forEach(function (date) {
            var exists = Modules.Database.database.transhis.existTransHisDB(code, new Date(date));
            dates[date] = exists;
        });
        return dates;
    };
    Progress.prototype.getCodeNextDate = function (code) {
        var dates = this.Dates[code];
        dates = dates || this.getCodeDates(code);
        this.Dates[code] = dates;
        var dateKeys = Object.keys(dates);
        for (var i = 0; i < dateKeys.length; i++) {
            var date = dateKeys[i];
            if (!dates[date]) {
                dates[date] = true;
                return new Date(date);
            }
        }
        return null;
    };
    Progress.prototype.getNext = function () {
        if (this.CodesIndex < this.Codes.length) {
            var code = this.Codes[this.CodesIndex];
            var dates = this.Dates[code];
            dates = dates || this.getCodeDates(code);
            this.Dates[code] = dates;
            var date = this.getCodeNextDate(code);
            if (date) {
                return { code: code, date: date };
            }
            else {
                delete this.Dates[code];
                this.CodesIndex++;
                return this.getNext();
            }
        }
    };
    return Progress;
}());
// let codeKeys = Object.keys(codes);
// let codeKeysIndex = 0;
var progress = new Progress();
var threadCount = 100;
// async function  update(date?: Date) {    
//     date = date || new Date();
//     while(codeKeysIndex < codeKeys.length) {
//         let index = codeKeysIndex;
//         codeKeysIndex++;
//         let code = codeKeys[index];
//         if (!transHis.database.transhis.existTransHisDB(code, date)) {
//             await transHis.update(code, date);
//         }
//     }
// }
function update2() {
    return __awaiter(this, void 0, void 0, function () {
        var code;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = progress.getNext();
                    _a.label = 1;
                case 1:
                    if (!code) return [3 /*break*/, 4];
                    if (!!transHis.database.transhis.existTransHisDB(code.code, code.date)) return [3 /*break*/, 3];
                    return [4 /*yield*/, transHis.update(code.code, code.date)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
for (var i = 0; i < threadCount; i++) {
    update2();
}
