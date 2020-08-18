import * as fs from 'fs'
import * as Lowdb from 'lowdb'
import FileSync  = require('lowdb/adapters/FileSync')
import * as Services from '../../services'
import { Database } from './database';
import { IInvestmentReturn } from '../dts';

export class Incomes {
    db: Lowdb.LowdbSync<any>;
    filename: string;
    csvfilename: string;
    database: Database;
    constructor(database: Database) {
        this.database = database;
        this.filename = './database/incomes.json';
        this.csvfilename = './database/incomes.csv';
        this.db = Lowdb(new FileSync(this.filename));
        this.db.defaults({}).write();
        this.initCSV();
    }

    destroy() {

    }

    initCSV(force?: boolean) {
        if (force || !fs.existsSync(this.csvfilename)) {
            let title = `code,high,sechigh,low,average,middle,current,stepprice,stepvolume,points,buyCount,saleCount,capital,income,rate` + '\r\n';
            fs.writeFileSync(this.csvfilename, title);
        }
    }
    resetCSV() {
        this.initCSV(true);
    }

    clearData() {
        this.db.setState({}).write();
    }

    setData(code: string, data: IInvestmentReturn ) {
        return this.db.set(code, data).write();
    }
    getData(code): IInvestmentReturn {
        return this.db.get(code).value();
    }
    async setCSV(code: string, data: IInvestmentReturn): Promise<boolean> {
        let res = data;
        let record =`${res.code}` +
                    `,${res.params.prices.high},${res.params.prices.sechigh},${res.params.prices.low},${res.params.prices.average},${res.params.prices.middle},${res.params.prices.current}` + 
                    `,${res.params.step.price},${res.params.step.volume}` + 
                    `,${Object.keys(res.points).toString().replace(/,/g, '-')}` +
                    `,${res.income.buyCount},${res.income.saleCount},${res.income.capital},${res.income.income},${res.income.rate}` + '\r\n';
        return new Promise((resolve, reject) => {
            fs.appendFile(this.csvfilename, record, (err) => {
                if (err) console.error(err.message);
                resolve(!err);
            })
        })

    }
    async setDataAndCSV(code: string, data: IInvestmentReturn ) {
        await this.setData(code, data);
        await this.setCSV(code, data);        
    }    

    async exportToCSV(filename?: string) {
        let codes = this.db.keys().value();
        this.resetCSV();
        for (let i = 0; i < codes.length; i++) {
            let code = codes[i];
            let data = this.db.get(code).value();
            await this.setCSV(code, data)            
        }
    }

}