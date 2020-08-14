import * as Modules from '../modules'

let transHis = new Modules.TransHis();



// let codeKeys = Object.keys(codes);
// let codeKeysIndex = 0;


let progress = new Modules.Progress()
let threadCount = 1;


// async function  update(date?: Date) {    
//     date = date || new Date();
//     while(codeKeysIndex < codeKeys.length) {
//         let index = codeKeysIndex;
//         codeKeysIndex++;
//         let code = codeKeys[index];
//         if (!transHis.database.transhis.existTransHisDB(code, date)) {
//             await transHis.update(code, date);
//         }
//     }
// }


async function  update2() { 
    while (true) {
        let code = progress.getNext();
        if (code) {
            if (!transHis.database.transhis.existTransHisDB(code.code, code.date)) {
                console.log('111111', code)
                await transHis.update(code.code, code.date);
            }     
        } else {
            break;
        }   
    }
}

for (let i = 0; i < threadCount; i++) {
    update2();    
}

