import * as Modules from '../modules'
import * as Services from '../services'

let transHis = new Modules.TransHis();
let codes = transHis.database.codes.getSHCodes()

// codes = {
//     "60000":""
// }

let keys = Object.keys(codes);
let keysIndex = 0;

async function  update(date?: Date) {    
    date = date || new Date();
    while(keysIndex < keys.length) {
        let index = keysIndex;
        keysIndex++;
        let code = keys[index];
        if (!transHis.database.transhis.existTransHisDB(code, date)) {
            await transHis.update(code, date);
        }
    }
}

for (let i = 0; i < 10; i++) {
    update();    
}
