import * as Modules from '../modules'
import * as Services from '../services'



async function  update() {    
    await Services.Database.Codes.updateSHCodes(Modules.Database.database.codes);
    await Services.Database.Codes.updateSZCodes(Modules.Database.database.codes);
    let shCodes = Modules.Database.database.codes.getSHCodes();
    let szCodes = Modules.Database.database.codes.getSZCodes();
    console.log(`sh ${Object.keys(shCodes).length}, sz ${Object.keys(szCodes).length} `)

}

update();    

