var http = require('http');
var iconv = require('iconv-lite'); 
var BufferHelper = require('bufferhelper');
var proxy = require("node-global-proxy").default;
var globalTunnel = require('global-tunnel-ng');
var proxys = require('./proxy.js')
// console.log(proxys)

var Host = 'market.finance.sina.com.cn'
var Path = '/transHis.php?symbol={code}&date={date}&page={page}'




var getTransHis = async (code, date, page) => {
    return new Promise((resolve, reject) => {
        var options = {
            host: Host,
            path: Path.replace('{code}', code).replace('{date}', date).replace('{page}', page)
        };  

    
        callback = (response) => {
            var bufferHelper = new BufferHelper();
            response.on('data', function (chunk) {
                console.log('response data')
                bufferHelper.concat(chunk);
            });
        
            response.on('end', function () {
                var strBuffer =  iconv.decode(bufferHelper.toBuffer(),'GBK');
                items = strBuffer.split('\r\n')
                console.log('response end ')


            });

            response.on('error', function(err) {
                console.log('response error: ', err.message)
            })

            response.on('close', function() {
                console.log('response close')
            })
            
        }
    
        var request = http.request(options, callback);
        request.on('error', function(err) {
            console.log('request error: ', err.message)
        })
        
        request.end(()=> {
            console.log('request end')
        });
    })


}

// getTransHis("sh603993", "2020-06-24", 1);


var checkProxy = async (host, port) => {
    return new Promise((resolve, reject) => {
        globalTunnel.initialize({
            host: host,
            port: port
          });


        var options = {
            host: "www.baidu.com"
        };  

    
        callback = (response) => {
            var bufferHelper = new BufferHelper();
            response.on('data', function (chunk) {
                // console.log('response data')
                bufferHelper.concat(chunk);
            });
        
            response.on('end', function () {
                var strBuffer =  iconv.decode(bufferHelper.toBuffer(),'GBK');
                items = strBuffer.split('\r\n')
                if (strBuffer) {
                    console.log(`${host}:${port}`)
                }
                
                resolve();
            });

            response.on('error', function(err) {
                // console.log('response error: ', err.message)
                resolve();
            })

            response.on('close', function() {
                // console.log('response close')
            })
            
        }
    
        var request = http.request(options, callback);
        request.on('error', function(err) {
            // console.log('request error: ', err.message)
            resolve();
        })
        
        request.end(()=> {
            // console.log('request end')
            // resolve();
        });
    })
}

var checkProxy1 = async (host, port) => {
    return new Promise((resolve, reject) => {
        var request = require('request');

        request({
          'url':'http://www.baidu.com',
          'method': "GET",
          'proxy':`http://${host}:${port}`
        },function (error, response, body) {
          if (!error && response.statusCode == 200) {
            // console.log(`11111 ${host}:${port}`);
            resolve(true)
          } else {
              if (!error && response) {
                // console.log(`22222 ${host}:${port} ` + response.statusCode);
                //   resolve(false)
                  reject(new Error(response.statusCode))
              } else {
                // console.log(`33333 ${host}:${port} ` + error.message);
                //   resolve(false)
                  reject(error)
              }
          }
        })        
    })    
}

var proxyKeys = Object.keys(proxys);
var checkIndex = -1;


async function start() {    
    while(checkIndex < proxyKeys.length) {
        checkIndex++;
        const host = proxyKeys[checkIndex];
        const port = proxys[host];
        console.log(`start checking: ${checkIndex} ${host} : ${port}`)
        try {
            await checkProxy1(host, port);      
            console.log(`----------------------------- ${host} : ${port}`)      
        } catch (error) {
            console.error(`check error ${host} : ${port}:` + error.message)
            
        }
    }


    // for (let index = 0; index < proxyKeys.length; index++) {
    //     const host = proxyKeys[index];
    //     const port = proxys[host];
    //     console.log(`start checking: ${host} : ${port}`)
    //     try {
    //         await checkProxy1(host, port);      
    //         console.log('check end')      
    //     } catch (error) {
    //         console.error(`check error:` + error.message)
            
    //     }
        
    // }
}

for (let i = 0;  i < 100; i ++) {
    Po
    start();   
}
