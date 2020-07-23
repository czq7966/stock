import * as Lowdb from 'lowdb'
import FileSync  = require('lowdb/adapters/FileSync')
import * as Services from '../../services'
import * as path from 'path'
import * as fs from 'fs';
import * as polyfills from '../../polyfills'

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
    // db: Lowdb.LowdbSync<any>;
    // filename: string;
    dbs: {[filename: string]: Lowdb.LowdbSync<any>};
    constructor() {
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

    getDBCodePath(): string {
        return path.resolve(this.getDBPath(), 'code')
    }

    getDBDataPath(): string {
        return path.resolve(this.getDBPath(), 'data')
    }    

    getTransHisFilename(code: string, date: Date): string {
        return path.resolve(this.getDBDataPath(),  code +'/transhis/' + this.getDateKey(date) + '.json' )
    }

    getChdDataKey(code?: string): string {
        return 'chddata';
    }
    getTransHisKey(code?: string): string {
        return 'transhis';
    }
    getDateKey(date: Date): string {
        return  date.format('yyyyMMdd');
    }

    getTransHisDB(code: string, date: Date) {
        let filename = this.getTransHisFilename(code, date);
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

    async update(code: string, date: Date, records: ITransHisRecord[]) {
        await Services.Database.TransHis.update(this, code, date, records);
    }
}