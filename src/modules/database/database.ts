import { Codes } from "./codes";
import { TransHis } from "./transhis";
import { Proxys } from "./proxys";
import { ChdData } from "./chddata";

export class Database {
    codes: Codes;
    transhis: TransHis;
    proxys: Proxys;
    chddata: ChdData;
    constructor() {
        this.codes = new Codes(this);
        this.transhis = new TransHis(this);
        this.proxys = new Proxys(this);
        this.chddata = new ChdData(this);
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