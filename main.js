var http = require('http');
var iconv = require('iconv-lite'); 
var BufferHelper = require('bufferhelper');

var CalDays = 365 * 1;
var Capital = 3000;
var Earning = 100;


Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}



var Host = 'quotes.money.163.com'
var Path = '/service/chddata.html?code={code}&start={start}&end={end}&fields=TCLOSE;HIGH;LOW;TOPEN;LCLOSE;CHG;PCHG;TURNOVER;VOTURNOVER;VATURNOVER;TCAP;MCAP'
var Codes = ['0603993']
var StartNow = new Date(new Date().setDate(new Date().getDate() - CalDays))
var EndNow = new Date()
var StartDate = StartNow.Format('yyyyMMdd')
var EndDate = EndNow.Format('yyyyMMdd')
var Data = {}

onData = (code, items) => {
    var records = [];
    items.forEach(item => {
        item = item.split(',')
        var record = {}
        var i = 0;
        record.DATE         = item[i++]
        record.CODE         = item[i++]
        record.Name         = item[i++] && null
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
    checkData(Data)
}

checkData = (data) => {
    Object.keys(data).forEach((key) => {
        var records = data[key]
        var i = 0;
        records.forEach(record => {
            var lclose = record.LCLOSE;
            var high = Math.max(lclose, record.HIGH)
            var low = Math.min(lclose, record.LOW)
            var capital = 100 / ((high - low) / lclose)
            if (Capital - capital >= 0) {
                // console.log(record.DATE, capital)
                i++;
            }
        })
        console.log(i / records.length)

    })
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
