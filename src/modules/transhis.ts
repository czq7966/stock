import * as Database from './database'
import * as Services from '../services'

export class TransHis {
    database: Database.Database;

    constructor() {
        this.database = Database.database;
    }

    destroy() {

    }

    async update(code: string, date: Date) {        
        await Services.Modules.TransHis.update(this, code, date);
    }
}