import "./polyfills"
import * as Modules from './modules'
import * as Services from './services'

let transHis = new Modules.TransHis();
let codes = transHis.database.codes.getSHCodes()

function Delay(timeout: number): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()            
        }, timeout);
    })
}

codes = {
    "603993":"",
    // "603129":"",
}

let keys = Object.keys(codes);

let  StartNow = new Date(new Date().setDate(new Date().getDate() - 365))

async function start()  {
    for (let index = 0; index < keys.length; index++) {
        const code = keys[index];
        await transHis.update(code, StartNow);
        console.log('1111111: ' + code);
        // await Delay(10 * 1000)
    }
}

// start();
async function test() {
    let proxys = await Modules.Database.database.proxys.checkValids();
    console.log(proxys, '有效个数：' + proxys.length );
    
}

Services.Database.Proxys.collectProxyFromKDL(Modules.Database.database.proxys)

// test();



// Object.keys(codes).forEach(async (code) => {
//     await transHis.update(code, new Date());
//     await Delay(30 * 1000)
//     console.log('1111111: ' + code);
// })
// transHis.update('603993', new Date());
// Modules.Database.database.transhis.update('123456', new Date(), [])