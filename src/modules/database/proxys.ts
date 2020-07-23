import * as path from 'path'
import * as Lowdb from 'lowdb'
import FileSync  = require('lowdb/adapters/FileSync')

import * as Services from '../../services'
import { threadId } from 'worker_threads';

export class Proxys {
    db: Lowdb.LowdbSync<any>;
    filename: string;
    valids: {[host: string]: number}
    constructor() {
        this.filename = path.resolve(__dirname, '../../../../database/proxys.json')
        this.db = Lowdb(new FileSync(this.filename));
        this.db.defaults({valids:{}, proxys: {}}).write();
    }

    destroy() {

    }

    async addProxy(host: string, port: number) {
        let proxys = this.db.get('proxys').value() as {};
        proxys[host] = port;
        this.db.set('proxys', proxys).write();
    }

    async addValid(host: string, port: number) {
        let valids = this.db.get('valids').value() as {};
        valids[host] = port;
        this.db.set('valids', valids).write();
    }

    async checkValids(): Promise<{[host: string]: number}> {
        return await Services.Database.Proxys.checkValids(this)
    }

    async getValids(): Promise<{[host: string]: number}> {
        if (this.valids && Object.keys(this.valids).length > 0) {
            return this.valids;
        } else {
            this.valids = await this.checkValids();
        }
        return this.valids;
    }

}
