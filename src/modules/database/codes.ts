// const Lowdb = require('lowdb');
import * as Lowdb from 'lowdb'
import FileSync  = require('lowdb/adapters/FileSync')

export class Codes {
    db: Lowdb.LowdbSync<any>;
    filename: string;
    constructor() {
        this.filename = './database/codes.json';
        this.db = Lowdb(new FileSync(this.filename));
    }

    destroy() {

    }
}