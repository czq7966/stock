import * as request from 'request'

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