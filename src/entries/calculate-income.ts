import * as Modules from '../modules'
import * as Services from '../services'


// Services.Database.TransHis.calCodeInvestParams(Modules.Database.database.transhis, "603993", {
//     capital:{min: 3800, max: 4200},
//     income: {min: 80, max: 120}
// })


// let investParams: Modules.Dts.IInvestParams = {
//     prices: {high: }
// }

// Services.Database.TransHis.calCodeInvestment(Modules.Database.database.transhis, "603993", null);

async function start() {
    let code = "600004";
    let investParams = await Services.Database.TransHis.calCodeInvestParams(Modules.Database.database.transhis,code, {
            capital:{min: 3800, max: 4200},
            income: {min: 80, max: 120}
        })

    console.log(investParams)

    investParams.prices.average = 16.6;
    investParams.prices.high = 20.0;
        
    let result = await Services.Database.TransHis.calCodeInvestment(Modules.Database.database.transhis, code, investParams);
    console.log(result)
    
}

start()