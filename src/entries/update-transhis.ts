import * as Modules from '../modules'
import * as Services from '../services'
import { threadId } from 'worker_threads';

let transHis = new Modules.TransHis();
// let codes = transHis.database.codes.getSHCodes()

// // codes = {
// //     "60000":""
// // }

class Progress {
    Codes: string[]
    CodesIndex: number;
    Dates: {[code: string] : {[date: string]: boolean}}

    constructor() {
        this.Codes = Object.keys(Modules.Database.database.codes.getSHCodes());
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
let threadCount = 100;


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
    let code = progress.getNext();
    while (code) {
        if (!transHis.database.transhis.existTransHisDB(code.code, code.date)) {
            await transHis.update(code.code, code.date);
        }        
    }
}

for (let i = 0; i < threadCount; i++) {
    update2();    
}

