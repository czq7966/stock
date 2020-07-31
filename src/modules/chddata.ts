import * as Database from './database'
import * as Services from '../services'

export class ChdData {
    database: Database.Database;

    constructor() {
        this.database = Database.database;
    }

    destroy() {

    }
}