import { Codes } from "./codes";
import { TransHis } from "./transhis";
import { Proxys } from "./proxys";
import { ChdData } from "./chddata";
import { Incomes } from "./incomes";

export class Database {
    codes: Codes;
    transhis: TransHis;
    proxys: Proxys;
    chddata: ChdData;
    incomes: Incomes;
    constructor() {
        this.codes = new Codes(this);
        this.transhis = new TransHis(this);
        this.proxys = new Proxys(this);
        this.chddata = new ChdData(this);
        this.incomes = new Incomes(this);
    }
    destroy() {
        this.codes.destroy();
        this.transhis.destroy();
        this.proxys.destroy();
        this.chddata.destroy();
        this.incomes.destroy();
        this.codes = null;
        this.transhis = null;
        this.proxys = null;
        this.incomes = null;
        this.chddata = null;
    }
}

export var database = new Database();
