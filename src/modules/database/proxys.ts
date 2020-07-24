import * as path from 'path'
import * as Lowdb from 'lowdb'
import FileSync  = require('lowdb/adapters/FileSync')

import * as Services from '../../services'
import { threadId } from 'worker_threads';
import { Database } from './database';

export class Proxys {
    db: Lowdb.LowdbSync<any>;
    filename: string;
    database: Database;
    constructor(database: Database) {
        this.database = database;
        this.filename = path.resolve(__dirname, '../../../../database/proxys.json')
        this.db = Lowdb(new FileSync(this.filename));
        this.db.defaults({valids:{}, valids2: {}, proxys: {}}).write();
    }

    destroy() {

    }

    async addProxy(host: string, port: number) {
        let proxys = this.db.get('proxys').value() as {};
        proxys[host] = port;
        this.db.set('proxys', proxys).write();
    }

    async addValid(host: string, port: number) {
        let valids = this.getValids();
        valids[host] = port;
        this.setValids(valids);
    }

    delValid(host: string) {
        let valids = this.getValids();
        delete valids[host];
        this.setValids(valids);
    }

    async checkValids(): Promise<{[host: string]: number}> {
        return await Services.Database.Proxys.checkValids(this)
    }

    getValids(): {[host: string]: number} {
        return this.db.get('valids').value();
    }

    setValids(value: {}) {
        this.db.set('valids', value).write();
    }    

}
