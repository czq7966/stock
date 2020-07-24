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
    let proxys = Modules.Database.database.proxys.getValids();
    let hosts = Object.keys(proxys);

    let valids = {}
    hosts.forEach(async host => {
        let port = proxys[host]
        try {
            let result = await Services.Database.Proxys.checkProxy(host, port); 
            if (result) {
                valids[host] = port;
                console.log(`---------------succeed ${host} ${port}`)            
            } else {
                Modules.Database.database.proxys.delValid(host);
                console.log(`============= delete ${host} ${port}`)            

            }
            
        } catch (error) {
            Modules.Database.database.proxys.delValid(host);
            console.error(`error ${host} ${port} ${error.message}`)
        }
    })

    return valids;
   
}

async function test2() {
    let valids = await test()
    console.log(valids)
}

// test2()


// Services.Database.Proxys.collectProxyFromK89IP(Modules.Database.database.proxys)

Services.Database.Codes.updateSZCodes(Modules.Database.database.codes)



// test();



// Object.keys(codes).forEach(async (code) => {
//     await transHis.update(code, new Date());
//     await Delay(30 * 1000)
//     console.log('1111111: ' + code);
// })
// transHis.update('603993', new Date());
// Modules.Database.database.transhis.update('123456', new Date(), [])