var http = require('http');
var iconv = require('iconv-lite'); 
var BufferHelper = require('bufferhelper');

var Host = 'market.finance.sina.com.cn'
var Path = '/transHis.php?symbol={code}&date={date}&page={page}'
//http://market.finance.sina.com.cn/transHis.php?symbol=sh603993&date=2020-06-24&page=1
var onData = (items) => {
    var records = [];
    items.forEach(item => {
        item = item.replace(/<tr ><th>/g,'\r\n').replace(/<\/td><td>/g, '\r\n').replace(/<\/th><td>/g, '\r\n').replace(/<\/td><th>/g, '\r\n').split('\r\n');
        var record = {}
        var i = 1;
        record.TIME         = item[i++]
        record.PRICE        = parseFloat(item[i++]) || 0
        record.CHANGE       = parseFloat(item[i++]) || 0
        record.VOTURNOVER   = parseFloat(item[i++]) || 0
        record.VATURNOVER   = parseFloat(item[i++]) || 0
        record.BOS          = null
        if (record.TIME) {
            records.push(record)
        }
    })
    return records;
}


var getTransHis = async (code, date, page) => {
    return new Promise((resolve, reject) => {
        var options = {
            host: Host,
            path: Path.replace('{code}', code).replace('{date}', date).replace('{page}', page)
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
                var records = '';
                if (count > 1) {
                    count = items.length    
                    for (let i = count - 1; i >= 0; i--) {
                        var item = items[i] || '';                        
                        if (item.indexOf("<tr ><th>") >=0 && item.indexOf("</th></tr>") > 0) {


                        } else {
                            items.splice(i, 1);
                         }                        
                    }
                    if (items.length > 0) {
                        items = items[0].split('</th></tr>')
                        records = onData(items)
                        resolve(records)
                    }
                }
            });
        }
    
        http.request(options, callback).end();
    })


}

module.exports = getTransHis;

getTransHis("sh603993", "2020-06-24", 1);
