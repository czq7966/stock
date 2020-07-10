var http = require('http');

//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
var options = {
  host: 'quotes.money.163.com',
  path: '/service/chddata.html?code=0603993&start=20200705&end=20200710&fields=TCLOSE;HIGH;LOW;TOPEN;LCLOSE;CHG;PCHG;TURNOVER;VOTURNOVER;VATURNOVER;TCAP;MCAP'
};

callback = function(response) {
  var str = '';

  //another chunk of data has been received, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been received, so we just print it out here
  response.on('end', function () {
    str = str.split('\r\n')
    str.forEach(record => {        
        items = record.split(',');
        console.log(items)
        
    })
    // console.log(str);
  });
}

http.request(options, callback).end();