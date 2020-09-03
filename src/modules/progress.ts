import * as Database from './database'

export class Progress {
    Codes: string[]
    CodesIndex: number;
    Dates: {[code: string] : {[date: string]: boolean}}

    constructor() {
        this.Codes = Object.keys(Database.database.codes.getSHCodes());
        this.CodesIndex = 0;
        this.Dates = {}
    }

    destroy() {

    }

    getCodeDates(code: string): {[date: string]: boolean} {
        let dates = {};
        let chddata = Database.database.chddata.getData(code);
        Object.keys(chddata).forEach(date => {
            let record = chddata[date];
            let exists = Database.database.transhis.existTransHisDB(code, new Date(date)) || (record.high == 0 && record.low == 0)
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
