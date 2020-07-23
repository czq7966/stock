var http = require('http')
var options = {
    hostname: '213.183.252.156',
    port: 8081,
    path: 'imququ.com:80',
    method: 'CONNECT'
};

var req = http.request(options);

req.on('connect', function(res, socket) {
    socket.write('GET / HTTP/1.1\r\n' +
                    'Host: imququ.com\r\n' + 
                    'Connection: Close\r\n' +
                    '\r\n');
            
    socket.on('data', function(chunk) {
        console.log(chunk.toString());
    })

    socket.on('end', function() {
        console.log('socket end')
    })


})