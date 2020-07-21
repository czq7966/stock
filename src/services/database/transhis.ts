import * as Modules from '../../modules'
export class TransHis {
    static async update(transHis: Modules.Database.TransHis, code: string, date: Date, records: Modules.Database.ITransHisRecord[]) {
        let db = transHis.getTransHisDB(code, date);
        db.set(transHis.getTransHisKey(code), records).write();
        // let exchgDataKey = transHis.getExchangeDataKey(code);
        // let chdDataKey = transHis.getChdDataKey(code);
        // let transHisKey = transHis.getTransHisKey(code);
        // let dateKey = transHis.getDateKey(date);
        // let data = transHis.db.get('data');
        
        // if (!data.has(code).value()) data.set(code, {}).value();
        // if (!data.has(exchgDataKey).value()) data.set(exchgDataKey, {}).value();
        // if (!data.has(chdDataKey).value()) data.set(chdDataKey, {}).value();
        // if (!data.has(transHisKey).value()) data.set(transHisKey, {}).value();
        
        // data.set(transHisKey + '.' + dateKey, records).value();
        // transHis.db.write();
    }
}