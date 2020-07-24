import * as Polyfills from '../../polyfills'
import * as Modules from '../../modules'


export class Codes {
    static async _requestCodeList(code: 'ha' | 'sa', page: number): Promise<{[code: string]: string}>  {
        let URL = 'http://app.finance.ifeng.com/list/stock.php?t={code}&f=chg_pct&o=desc&p={page}'
        let KeyStr =  '<td><a href="http://finance.ifeng.com/app/hq/stock/';        
        page = page || 1;
        let codes = {};

        let body = await Polyfills.requestPage({url: URL.replace('{code}', code).replace('{page}', page as any)});

        if (body) {
            let items = body.split('\r\n');
            let records = [];
            items.forEach(item => {
                if (item.indexOf(KeyStr) >= 0) {
                    let preFix = 'target="_blank">'
                    let subFix = '</a></td>';
                    
                    let startIndex = item.indexOf(preFix) + preFix.length;
                    let endIndex = item.indexOf(subFix)                    
                    records.push(item.substring(startIndex, endIndex))
                }                
            })

            let code: string;
            records.forEach(item => {
                if( parseInt(item) > 0) {
                    code = item;
                    codes[code] = '';
                } else {
                    codes[code] = ''; //item
                }
            })
        }
        
        if (Object.keys(codes).length > 0)        
            return codes;
        else 
            return null;

    }      

    static async requestCodeList(code: 'ha' | 'sa'): Promise<{[code: string]: string}>  {
        let codes = {};
        let page = 1;
        while(true) {
            try {
                let _codes = await this._requestCodeList(code, page);
                if (_codes && Object.keys(_codes).length > 0) {
                    codes = Object.assign(codes, _codes);
                    page++;
                }
                else {
                    break;                
                }
            } catch (error) {
                console.log(`get page ${page} error: ${error.message}` )
                
            }


        }
        console.log(Object.keys(codes).length)
        return codes;

    }
    static async updateSZCodes(codesDB: Modules.Database.Codes): Promise<boolean>  {
        let codes = codesDB.getSZCodes();
        let _codes = await this.requestCodeList('sa');
        codes = Object.assign(codes, _codes);
        if (codes && Object.keys(codes).length > 0) {
            codesDB.setSZCodes(codes);
            return true
        }

        return false;
    }   
} 
