import * as Modules from '../modules'
import * as Services from '../services'
import { threadId } from 'worker_threads';
import { timingSafeEqual } from 'crypto';

let transHis = new Modules.TransHis();

class Progress {
    Codes: string[]
    CodesIndex: number;
    Dates: {[code: string] : {[date: string]: boolean}}

    constructor() {
        this.Codes = Object.keys(Modules.Database.database.codes.getSHCodes());
        this.Codes = ["603993"];
        this.CodesIndex = 0;
        this.Dates = {}
    }

    destroy() {

    }

    getCodeDates(code: string): {[date: string]: boolean} {
        let dates = {};
        let chddata = Modules.Database.database.chddata.getData(code);
        Object.keys(chddata).forEach(date => {
            let exists = Modules.Database.database.transhis.existTransHisDB(code, new Date(date))            
            dates[date] = exists;
        })
        return dates;
    }

    getCodeNextDate(code: string): Date {
        let dates = this.Dates[code];            
        dates = dates || this.getCodeDates(code);
        this.Dates[code] = dates;

        let dateKeys = Object.keys(dates);
        for (let i = 0; i < dateKeys.length; i++) {
            let date = dateKeys[i];
            if (!dates[date]) {
                dates[date] = true;
                return new Date(date)
            }            
        }
        return null
    }

    getNext(): {code: string, date: Date} {
        if (this.CodesIndex < this.Codes.length) {
            let code = this.Codes[this.CodesIndex];
            let dates = this.Dates[code];            
            dates = dates || this.getCodeDates(code);
            this.Dates[code] = dates;
            let date = this.getCodeNextDate(code);
            if (date) {
                return {code: code, date: date}
            } else {
                delete this.Dates[code];
                this.CodesIndex++;
                return this.getNext()
            }
        }
    }
}


// let codeKeys = Object.keys(codes);
// let codeKeysIndex = 0;


let progress = new Progress()
let threadCount = 200;


// async function  update(date?: Date) {    
//     date = date || new Date();
//     while(codeKeysIndex < codeKeys.length) {
//         let index = codeKeysIndex;
//         codeKeysIndex++;
//         let code = codeKeys[index];
//         if (!transHis.database.transhis.existTransHisDB(code, date)) {
//             await transHis.update(code, date);
//         }
//     }
// }


async function  update2() { 
    while (true) {
        let code = progress.getNext();
        if (code) {
            if (!transHis.database.transhis.existTransHisDB(code.code, code.date)) {
                await transHis.update(code.code, code.date);
            }     
        } else {
            break;
        }   
    }
}

for (let i = 0; i < threadCount; i++) {
    update2();    
}

