import * as http from 'http';
import * as iconv from 'iconv-lite'
import * as BufferHelper from 'bufferhelper'

import * as Modules from '../../modules'
import * as Polyfills from '../../polyfills'
import * as GlobalTunnel from 'global-tunnel-ng';
import * as request from 'request'


var Options = {
    host: 'market.finance.sina.com.cn',
    path: '/transHis.php?symbol={symbol}&date={date}&page={page}'    
}


export class TransHis {
    static _onRequestEnd(items: string[]): Modules.Database.ITransHisRecord[] {
        let result = []
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
                result = this._onRequestData(items)
            } 
        }

        return result;
    }

    static _onRequestData(items: string[]): Modules.Database.ITransHisRecord[] {
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
    static async _getTransHis1(symbol: string, date: Date, page: number, proxyHost?: string, proxyPort?: number): Promise<Modules.Database.ITransHisRecord[]> {
        return new Promise((resolve, reject) => {
            if (proxyHost && proxyPort) {
                GlobalTunnel.initialize({host: proxyHost, port: proxyPort });    
            }

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
                    if (strBuffer.indexOf('<a href="downxls.php?date=') > 0) {
                        let items = strBuffer.split('\r\n')
                        let records = onEnd(items);
                        if (proxyHost && proxyPort) GlobalTunnel.end();
                        resolve(records)
                    } else {
                        reject(new Error('error page'))
                    }
                });

                response.on('error', function(err: Error) {
                    console.error('error: ', err.message)
                    if (proxyHost && proxyPort) GlobalTunnel.end();
                    reject(err)
                })
                
            }
        
            let request = http.request(options, callback);
            request.on('error', (err) => {
                if (proxyHost && proxyPort) GlobalTunnel.end();

                reject(err)
            })
            request.end();
        })
    }

    static async _getTransHis(symbol: string, date: Date, page: number, proxyHost?: string, proxyPort?: number): Promise<Modules.Database.ITransHisRecord[]> {
        return new Promise((resolve, reject) => {
            page = page || 1;
            let dateStr = date.format('yyyy-MM-dd');
            let options = {
                'url': 'http://' + Options.host + Options.path.replace('{symbol}', symbol).replace('{date}', dateStr).replace('{page}', page as any),
                'method': "GET",
                'timeout': 10 * 1000
            }
            if (proxyHost && proxyPort) options['proxy'] = `http://${proxyHost}:${proxyPort}`;

            request(options, (error, response, body) => {
              if (!error && response.statusCode == 200) {
                let strBuffer =  body as string;
                if (strBuffer.indexOf('<a href="downxls.php?date=') > 0) {
                    let items = strBuffer.split('\r\n')
                    let records = this._onRequestEnd(items);
                    resolve(records)
                } else {
                    reject(new Error('error page'))
                }          
              } else {
                  if (!error && response) {
                      reject(new Error(response.statusCode as any))
                  } else {
                      reject(error)
                  }
              }
            })        
        }) 
    }

    static async getTransHis(transHis: Modules.TransHis, code: string, date: Date, page?: number):  Promise<Modules.Database.ITransHisRecord[]> {
        page = page || 1;
        let symbol = (parseInt(code) >= 600000 && parseInt(code) < 700000 ? 'sh': 'sz') + code;

        let proxys = transHis.database.proxys.getValids();
        let proxyHosts = Object.keys(proxys);
        let proxysCount = proxyHosts.length;


        
        let records: Modules.Database.ITransHisRecord[] = [];
        let _records: Modules.Database.ITransHisRecord[] = [];

        let startTime = new Date();
        // console.log(`getting: ${code} ${date.format('yyyy-MM-dd')}`);
        while (true) {
            let index = Math.floor(Math.random() * proxysCount);
            let host = proxyHosts[index];
            let port = proxys[host];
            try {
                _records = await this._getTransHis(symbol, date, page, host, port);   
                if (_records && _records.length > 0) {
                    records = records.concat(_records);
                    console.log(`got page ${page} of ${code} ${date.format('yyyy-MM-dd')}`)
                    // await Polyfills.sleep(1000);
                    page++;
                } else {
                    break;
                }                
            } catch (error) {
                // console.error(`got ${code} ${date.format('yyyy-MM-dd')} error: ` + error.message)
                
            }

        } 
        let endTime = new Date()
        console.log(`end get: ${code} ${((endTime as any) - (startTime as any)) / 1000} Secs`);
        return records;
    }
    
    static async update(transHis: Modules.TransHis, code: string, date: Date) {
        let records = await this.getTransHis(transHis, code, date);
        if (records && records.length > 0) {
            await transHis.database.transhis.update(code, date, records);
        } else {
            console.error('222222222', code + ':' + date.format('yyyy-MM-dd') +' records empty')
        }
    }

    static async getPrices(transHis: Modules.TransHis, code: string) {

    }

    static async getDateRecords(transHis: Modules.TransHis, code: string, date: Date):  Promise<Modules.Database.ITransHisRecord[]> {
        let prices: []
        let dateKey =  date.format('yyyy-MM-dd');
        let db = transHis.database.transhis.existTransHisDB(code, date) ? transHis.database.transhis.getTransHisDB(code, date, true): null;
        if (db) {
            prices = db.get("transhis").value() as []
        }
        return prices;
    }

    static async checkDateRecords(transHis: Modules.TransHis, prices: Modules.Database.ITransHisRecord[]): Promise<boolean> {
        //Todo        
        return true;
    }

    static async getAndCheckDateRecords(transHis: Modules.TransHis, code: string, date: Date) {
        let prices = await this.getDateRecords(transHis, code, date);
        if (prices && this.checkDateRecords(transHis, prices)) {
            return prices;
        } else {
            return [];
        }
    }

    static async trimPrices(transHis: Modules.TransHis, records: Modules.Database.ITransHisRecord[]): Promise<number[]> {        
        let prices = [];
        records.forEach(record => {
            prices.push(record.price)
        })
        return prices;
    }

    static async reversePrices(transHis: Modules.TransHis, prices: number[]): Promise<number[]> {        
        let temp = [];
        for (let i = prices.length - 1; i >= 0; i--) {
            temp.push(prices[i])            
        }
        return temp;
    }    

    static async getDatePrices(transHis: Modules.TransHis, code: string, date: Date, reverse?: boolean) {
        let records = await this.getAndCheckDateRecords(transHis, code, date);
        let prices = await this.trimPrices(transHis, records);
        prices = reverse ? await this.reversePrices(transHis, prices) : prices;
        return prices;
    }
    static async getTrimDatesPrices(transHis: Modules.TransHis, code: string, days: number, end?: Date) {
        // let date = start 
        // let prices = await this.getDatePrices(transHis, code, )

        
    }   
}