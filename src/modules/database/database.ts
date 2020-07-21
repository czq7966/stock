import { Codes } from "./codes";
import { TransHis } from "./transhis";

export class Database {
    codes: Codes;
    transhis: TransHis;
    constructor() {
        this.codes = new Codes();
        this.transhis = new TransHis();
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