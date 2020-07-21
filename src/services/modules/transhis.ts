import * as http from 'http';
import * as iconv from 'iconv-lite'
import * as BufferHelper from 'bufferhelper'

import * as Modules from '../../modules'


var Options = {
    host: 'market.finance.sina.com.cn',
    path: '/transHis.php?symbol={symbol}&date={date}&page={page}'    
}


export class TransHis {
    static async _getTransHis(symbol: string, date: Date, page: number): Promise<Modules.Database.ITransHisRecord[]> {
        return new Promise((resolve, reject) => {
            page = page || 1;
            let dateStr = date.format('yyyy-MM-dd')
            let options = {
                host: Options.host,
                path: Options.path.replace('{symbol}', symbol).replace('{date}', dateStr).replace('{page}', page as any)
            }

            let onData = (items: string[]) => {
                var records = [];
                items.forEach(item => {                    
                    let itemArr = item.replace(/<tr ><th>/g,'\r\n').replace(/<\/td><td>/g, '\r\n').replace(/<\/th><td>/g, '\r\n').replace(/<\/td><th>/g, '\r\n').split('\r\n');
                    let i = 1;
                    let record: Modules.Database.ITransHisRecord = {
                        time: itemArr[i++],
                        price: parseFloat(itemArr[i++]) || 0,
                        change: parseFloat(itemArr[i++]) || 0,
                        voturnover: parseFloat(itemArr[i++]) || 0,
                        vaturnover: parseFloat((itemArr[i++] || '').replace(',', '')) || 0
                    }
                    if (record.time) {
                        records.push(record)
                    }
                })
                return records;
            }
            let onEnd = (items: string[]) => {
                if (items.length > 1) {
                    let count = items.length    
                    for (let i = count - 1; i >= 0; i--) {
                        var item = items[i] || '';                        
                        if (item.indexOf("<tr ><th>") >=0 && item.indexOf("</th></tr>") > 0) {
                        } else {
                            items.splice(i, 1);
                         }                        
                    }
                    if (items.length > 0) {
                        items = items[0].split('</th></tr>')
                        return onData(items)
                    }
                } else {
                    return []
                }                
            }
    
            let callback = (response) => {
                var bufferHelper = new BufferHelper();
                response.on('data', function (chunk) {
                    bufferHelper.concat(chunk);
                });
            
                response.on('end', function () {
                    let strBuffer =  iconv.decode(bufferHelper.toBuffer(),'GBK');
                    let items = strBuffer.split('\r\n')
                    let records = onEnd(items);
                    resolve(records)
                });
                
            }
        
            http.request(options, callback).end();
        })
    }

    static async getTransHis(code: string, date: Date, page?: number):  Promise<Modules.Database.ITransHisRecord[]> {
        page = page || 1;
        let dateStr = date.format('yyyyMMdd');
        let symbol = (parseInt(code) >= 600000 && parseInt(code) < 700000 ? 'sh': 'sz') + code;

        
        let records: Modules.Database.ITransHisRecord[] = [];
        let _records: Modules.Database.ITransHisRecord[] = [];

        while (true) {
            _records = await this._getTransHis(symbol, date, page);   
            if (_records && _records.length > 0) {
                records = records.concat(_records);
                page++;
            } else {
                break;
            }
        } 
        return records;
    }
    
    static async update(transHis: Modules.TransHis, code, date: Date) {
        let records = await this.getTransHis(code, date);
        await transHis.database.transhis.update(code, date, records);
    }
}