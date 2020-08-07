import * as Modules from '../../modules'
export class TransHis {
    static async update(transHis: Modules.Database.TransHis, code: string, date: Date, records: Modules.Database.ITransHisRecord[]) {
        let db = transHis.getTransHisDB(code, date);
        db.set(transHis.getTransHisKey(code), records).write();
    }

    static async calCodeInvestment(investment: Modules.Dts.IInvestment ) {

    }
}