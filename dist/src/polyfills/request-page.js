"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestBuffer = exports.requestPage = void 0;
var request = require("request");
var http = require("http");
var BufferHelper = require("bufferhelper");
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
function requestBuffer(options) {
    return new Promise(function (resolve, reject) {
        var callback = function (response) {
            var bufferHelper = new BufferHelper();
            response.on('data', function (chunk) {
                bufferHelper.concat(chunk);
            });
            response.on('end', function () {
                resolve(bufferHelper.toBuffer());
            });
            response.on('error', function (err) {
                reject(err);
            });
        };
        var req = http.request(options, callback);
        req.on('error', function (err) {
            reject(err);
        });
        req.end();
    });
}
exports.requestBuffer = requestBuffer;
