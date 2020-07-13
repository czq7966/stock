var http = require('http');
var iconv = require('iconv-lite'); 
var BufferHelper = require('bufferhelper');



var Host = 'quotes.money.163.com'
var Path = '/service/chddata.html?code={code}&start={start}&end={end}&fields=TCLOSE;HIGH;LOW;TOPEN;LCLOSE;CHG;PCHG;TURNOVER;VOTURNOVER;VATURNOVER;TCAP;MCAP'
var Codes = ['0603993']
var StartDate = '20200710'
var EndDate = '20200713'
var Data = {}



onData = (code, items) => {
    var records = [];
    items.forEach(item => {
        item = item.split(',')
        var record = {}
        var i = 0;
        record.DATE         = item[i++]
        record.CODE         = item[i++]
        record.Name         = item[i++]
        record.TCLOSE       = parseFloat(item[i++])
        record.HIGH         = parseFloat(item[i++])
        record.LOW          = parseFloat(item[i++])
        record.TOPEN        = parseFloat(item[i++])
        record.LCLOSE       = parseFloat(item[i++])
        record.CHG          = parseFloat(item[i++])
        record.PCHG         = parseFloat(item[i++])
        record.TURNOVER     = parseFloat(item[i++])
        record.VOTURNOVER   = parseFloat(item[i++])
        record.VATURNOVER   = parseFloat(item[i++])
        record.TCAP         = parseFloat(item[i++])
        record.MCAP         = parseFloat(item[i++])
        records.push(record)
    })

    Data[code] = records;
    console.log(Data)
}


Codes.forEach((code) => {    
    var options = {
        host: Host,
        path: Path.replace('{code}', code).replace('{start}', StartDate).replace('{end}', EndDate)
    };   


    callback = (response) => {
        var bufferHelper = new BufferHelper();
        response.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });
    
        response.on('end', function () {
            var strBuffer =  iconv.decode(bufferHelper.toBuffer(),'GBK');
            
            items = strBuffer.split('\r\n')
            var count = items.length
            if (count > 1) {
                console.log(items[0])
                items = items.slice(1);
                count = items.length        
                for (let i = count - 1; i >= 0; i--) {
                    item = items[i];
                    if (item && item.length > 0) {                        
                    } else {
                        items = items.slice(0, i)
                    }
                }
                if (items.length > 0)
                    onData(code, items)
            }
        });
    }

    http.request(options, callback).end();
})
