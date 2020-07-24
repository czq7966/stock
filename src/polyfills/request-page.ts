import * as request from 'request'
import * as http from 'http';
import * as iconv from 'iconv-lite'; 
import * as BufferHelper from 'bufferhelper';

export function requestPage(options): Promise<any> {
    return new Promise((resolve, reject) => {
        options['method'] = options['method'] || 'GET';
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            } else {
                if (!error && response) {
                    reject(new Error(response.statusCode))
                } else {
                    reject(error)
                }
            }
        })
    })
}


export function requestBuffer(options): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        let callback = (response) => {
            var bufferHelper = new BufferHelper();
            response.on('data', function (chunk) {
                bufferHelper.concat(chunk);
            });
        
            response.on('end', () => {
                resolve(bufferHelper.toBuffer())
            });
            response.on('error', (err) => {
                reject(err)
            })
        }
    
        let req = http.request(options, callback);
        req.on('error', (err) => {
            reject(err)
        })
        req.end();     
    })
}

