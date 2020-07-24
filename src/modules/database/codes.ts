import * as Lowdb from 'lowdb'
import FileSync  = require('lowdb/adapters/FileSync')
import * as Services from '../../services'
import { Database } from './database';

export class Codes {
    db: Lowdb.LowdbSync<any>;
    filename: string;
    database: Database;
    constructor(database: Database) {
        this.database = database;
        this.filename = './database/codes.json';
        this.db = Lowdb(new FileSync(this.filename));
        this.db.defaults({sh: {}, sz: {}}).write();
    }

    destroy() {

    }

    getSHCodes(): {[code: string]: string} {
        return this.db.get('sh').value()
    }
    getSZCodes(): {[code: string]: string} {
        return this.db.get('sz').value()
    }

    setSHCodes(codes: {}) {
        this.db.set('sh', codes).write();
    }

    setSZCodes(codes: {}) {
        this.db.set('sz', codes).write();
    }

    async update() {
        await Services.Database.Codes.update(this);
    }
}