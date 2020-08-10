import * as iconv from 'iconv-lite'; 
import * as BufferHelper from 'bufferhelper';
import * as Polyfills from '../../polyfills'
import * as Modules from '../../modules'

let Option = {
    host: 'quotes.money.163.com',
    path: '/service/chddata.html?code={code}&start={start}&end={end}&fields=TCLOSE;HIGH;LOW;TOPEN;LCLOSE;CHG;PCHG;TURNOVER;VOTURNOVER;VATURNOVER;TCAP;MCAP'

}


export class ChdData {
    static async _requestCodeData(code: string, start: Date, end: Date): Promise<Modules.Database.IChdDataDateRecords>  {
        let startStr = start.format('yyyyMMdd')
        let endStr = end.format('yyyyMMdd')

        let options = {
            host: Option.host,
            path: Option.path.replace('{code}', code).replace('{start}', startStr).replace('{end}', endStr),
        }
        
        let body = await Polyfills.requestBuffer(options);

        if (body) {            
            let strBuffer =  iconv.decode(body,'GBK');
            let _items = strBuffer.split('\r\n')
            let items = [];
            _items = _items.slice(1);
            _items.forEach(item => {
                if (item && item.length > 0) {
                    items.push(item)
                }
            })


            let records: Modules.Database.IChdDataDateRecords = {};
            items.forEach(item => {
                item = item.split(',')
                let record:  Modules.Database.IChdDataRecord = {} as any;
                var i = 0;
                record.date         = item[i++]
                record.code         = (item[i++] || '').replace('\'', '')
                record.name         = item[i++] && null
                record.tclose       = parseFloat(item[i++])
                record.high         = parseFloat(item[i++])
                record.low          = parseFloat(item[i++])
                record.topen        = parseFloat(item[i++])
                record.lclose       = parseFloat(item[i++])
                record.chg          = parseFloat(item[i++])
                record.pchg         = parseFloat(item[i++])
                record.turnover     = parseFloat(item[i++])
                record.voturnover   = parseFloat(item[i++])
                record.vaturnover   = parseFloat(item[i++])
                record.tcap         = parseFloat(item[i++])
                record.mcap         = parseFloat(item[i++])
                records[record.date] = record
            })  

            return records;
        }
        return;
        

    }      

    static async requestCodeData(code: string, days: number, end?: Date):  Promise<Modules.Database.IChdDataDateRecords>  {
        code = '0000000' + code;
        code = code.substr(code.length - 7)
        end = end || new Date();
        let start = new Date(new Date().setDate(end.getDate() - days));
        let result;
        while (true) {
            try {
                result =  await this._requestCodeData(code, start, end);
                break;                
            } catch (error) {
                console.log(`get error: ${code} ${error.message}`)                
            }
        }

        return result;

        
    }

    
    static async updateChdData(chdDataDB: Modules.Database.ChdData, excCode: 'sh' | 'sz', days: number, end?: Date): Promise<boolean>  {
        end = end || new Date()
        let codes = excCode == 'sh' ? chdDataDB.database.codes.getSHCodes() :chdDataDB.database.codes.getSZCodes() ;
        let keys = Object.keys(codes);
        for (let i = 0; i < keys.length; i++) {
            let code = keys[i];
            let records = await this.requestCodeData(code, days, end);
            if (records) {
                let data = chdDataDB.getData(code);
                // data = Object.assign(records);
                data = records;
                chdDataDB.setData(code, data);
                console.log(`got ${i} / ${keys.length}`)
            }            
        }

        return true;
    }   
    
    static async  update(chdDataDB: Modules.Database.ChdData, days: number, end?: Date) {    
        end = end || new Date();
        await this.updateChdData(chdDataDB, 'sh', days, end);
        // await this.updateChdData(chdDataDB, 'sz', days, end);    
    }

    static async averagePrice(chdDataDB: Modules.Database.ChdData, code: string): Promise<number> {
        let records = chdDataDB.getData(code);
        let vaturnover = 0;
        let voturnover= 0;
        Object.values(records).forEach(record => {
            vaturnover += record.vaturnover;
            voturnover += record.voturnover;
        })

        return vaturnover / voturnover;
    }

    static async averagePrices(chdDataDB: Modules.Database.ChdData, codes?: string[]): Promise<{[code: string]: number}> {
        let results = {};
        if (!codes) {
            let shCodes = chdDataDB.database.codes.getSHCodes();
            codes = Object.keys(shCodes);
        }

        codes.forEach(async code => {
            let price = await this.averagePrice(chdDataDB, code);
            results[code] = price;
        })

        return results;
    }    

    static async getCodePrices(chdDataDB: Modules.Database.ChdData, code: string): Promise<Modules.Database.IChdDataCodePrices> {
        let records = chdDataDB.getData(code);
        let high = 0, low = 0, middle = 0, average = 0;
        let vaturnover = 0;
        let voturnover= 0;
        Object.values(records).forEach(record => {
            high = Math.max(high, record.high);
            low = Math.min(low || 99999, record.low || 99999);            
            vaturnover += record.vaturnover;
            voturnover += record.voturnover;
        })

        average = Math.round(vaturnover / voturnover * 100) / 100;
        middle = Math.round((high + low) / 2 * 100) / 100;

        return {high: high, low: low, middle: middle, average: average}
    }    
} 
