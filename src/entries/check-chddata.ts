import * as Modules from '../modules'
import * as Services from '../services'

let progress = new Modules.Progress()

async function  start() { 
    let codes = progress.Codes;
    // codes = ["600410"]
    for (let i = 0; i < codes.length; i++) {
        let code = codes[i];        
        let dates = await Object.keys(progress.getCodeDates(code));
        for (let j = 0; j < dates.length; j++) {
            let date = new Date(dates[j]);
            if ( date as any == "Invalid Date") {                
                console.log(`${code} Invalid Date: ${dates[j]}`)
                await Services.Database.ChdData.updateCodeChdData(Modules.Database.database.chddata, code, 400)

                break;
            }
            
        }
    }
}

start()

