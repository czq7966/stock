import * as Modules from '../modules'

let transHis = new Modules.TransHis();



// let codeKeys = Object.keys(codes);
// let codeKeysIndex = 0;


let progress = new Modules.Progress()
let threadCount = 200;



async function  start() { 
    while (true) {
        let code = progress.getNext();
        if (code) {
            if (!transHis.database.transhis.existTransHisDB(code.code, code.date)) {
                await transHis.update(code.code, code.date);
            }     
        } else {
            break;
        }   
    }
}

global

for (let i = 0; i < threadCount; i++) {
    start();    
}

