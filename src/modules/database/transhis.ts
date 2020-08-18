import * as Lowdb from 'lowdb'
import FileSync  = require('lowdb/adapters/FileSync')
import * as Services from '../../services'
import * as path from 'path'
import * as fs from 'fs';
import * as polyfills from '../../polyfills'
import { Database } from './database';

export interface ITransHisRecord {
    time: string
    price: number
    change: number
    voturnover: number
    vaturnover: number
    bos?: string
}

export interface ITransHisDateRecords {
    [date: string]: ITransHisRecord[]
}

export interface ITransHisRecords {
    [code: string]: ITransHisDateRecords
}

export class TransHis {
    dbs: {[filename: string]: Lowdb.LowdbSync<any>};
    database: Database;
    constructor(database: Database) {
        this.database = database;
        this.init();
    }

    destroy() {

    }
    init() {
        this.dbs = {}
    }    

    getDBPath(): string {
        return path.resolve(__dirname, '../../../../database')
    }

    getDBDataPath(): string {
        return path.resolve(this.getDBPath(), 'data')
    }    

    getChdDataKey(): string {
        return 'chddata';
    }
    getTransHisKey(code?: string): string {
        return 'transhis';
    }
    getDateKey(date: Date): string {
        return  date.format('yyyyMMdd');
    }    

    getTransHisFilename(code: string, date: Date): string {
        return path.resolve(this.getDBDataPath(),  `${code}/${this.getTransHisKey()}/${this.getDateKey(date)}.json` )
    }
    getChdDataFilename(code: string): string {
        return path.resolve(this.getDBDataPath(),  `${code}/${this.getChdDataKey()}/${code}.json` )
    }

    getTransHisDB(code: string, date: Date, writeDefault: boolean) {
        let filename = this.getTransHisFilename(code, date);
        polyfills.mkdirsSync(path.dirname(filename));

        let db = this.dbs[filename];
        if (!db) {
            db = Lowdb(new FileSync(filename));
            writeDefault ? db.defaults({}).write() : null;
            this.dbs[filename] = db;            
        }
        return db;
    }

    getChdDataDB(code: string) {
        let filename = this.getChdDataFilename(code);
        polyfills.mkdirsSync(path.dirname(filename));

        let db = this.dbs[filename];
        if (!db) {
            db = Lowdb(new FileSync(filename));
            db.defaults({}).write();
            this.dbs[filename] = db;            
        }
        return db;
    }    

    existTransHisDB(code: string, date: Date): boolean {
        let filename = this.getTransHisFilename(code, date);
        return fs.existsSync(filename);
    }

    existChdDataDB(code: string): boolean {
        let filename = this.getChdDataFilename(code);
        return fs.existsSync(filename);
    }    

    async update(code: string, date: Date, records: ITransHisRecord[]) {
        await Services.Database.TransHis.update(this, code, date, records);
    }

    // async getCodeSimulData(code: string, )
}