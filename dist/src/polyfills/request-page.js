"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestPage = void 0;
var request = require("request");
function requestPage(options) {
    return new Promise(function (resolve, reject) {
        options['method'] = options['method'] || 'GET';
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
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
    });
}
exports.requestPage = requestPage;
