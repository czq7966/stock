import * as Lowdb from 'lowdb'
import FileSync  = require('lowdb/adapters/FileSync')
import * as Services from '../../services'
import * as path from 'path'
import * as fs from 'fs';
import * as polyfills from '../../polyfills'
import { Database } from './database';


export interface IChdDataRecord {
    date: string,
    code: string,
    name: string,
    tclose: number,
    high: number,
    low: number,
    topen: number,
    lclose: number,
    chg: number,
    pchg: number,
    turnover: number,
    voturnover: number,
    vaturnover: number
    tcap: number,
    mcap: number
}

export interface IChdDataDateRecords {
    [date: string]: IChdDataRecord
}

export interface IChdDataCodeDateRecords {
    [code: string]: IChdDataDateRecords
}


export class ChdData {
    database: Database;
    constructor(database: Database) {
        this.database = database;
    }

    destroy() {

    }

    getChdDataDB(code: string) {
        return this.database.transhis.getChdDataDB(code);
    }

    existChdDataDB(code: string): boolean {
        return this.database.transhis.existChdDataDB(code);
    }

    getData(code: string): IChdDataDateRecords {
        let db = this.getChdDataDB(code);
        return db.getState()
    }

    setData(code: string, data: IChdDataDateRecords ) {
        let db = this.getChdDataDB(code);
        return db.setState(data).write();
    }

    async update(days: number, end?: Date) {
        end = end || new Date()
        await Services.Database.ChdData.update(this, days, end);
        console.log('update end!')
    }

    async averagePrice(code: string ): Promise<number> {
        return await Services.Database.ChdData.averagePrice(this, code);
    }

    async averagePrices(codes?: string[]): Promise<{[code: string]: number}> {
        return await Services.Database.ChdData.averagePrices(this, codes)
    }    
}

