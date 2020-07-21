import "./polyfills"
import * as Modules from './modules'

let transHis = new Modules.TransHis();
transHis.update('603993', new Date());
// Modules.Database.database.transhis.update('123456', new Date(), [])