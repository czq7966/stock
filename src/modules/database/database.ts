import { Codes } from "./codes";
import { TransHis } from "./transhis";
import { Proxys } from "./proxys";

export class Database {
    codes: Codes;
    transhis: TransHis;
    proxys: Proxys;
    constructor() {
        this.codes = new Codes();
        this.transhis = new TransHis();
        this.proxys = new Proxys();
    }
    destroy() {
        this.codes.destroy();
        this.transhis.destroy();
        this.codes = null;
        this.transhis = null;
    }
}

export var database = new Database();
// export { database };