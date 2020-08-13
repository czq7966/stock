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

async function getCodeInvestmentReturn(code: string, params?: Modules.Dts.IInvestParams): Promise<Modules.Dts.IInvestmentReturn> {
    let investParams = await Services.Database.TransHis.calCodeInvestParams(Modules.Database.database.transhis,code, {
            capital:{min: 3800, max: 4200},
            income: {min: 80, max: 120}
        })

    if (investParams) {
        investParams = Object.assign(investParams, params);
        // investParams.prices.average = 16.6;
        // investParams.prices.high = 20.0;
            
        return Services.Database.TransHis.calCodeInvestmentReturn(Modules.Database.database.transhis, code, investParams);
    }    
}

async function start() {
    let codes = Object.keys(Modules.Database.database.codes.getSHCodes());
    // codes = ["600009"]
    for (let i = 0; i < 10; i++) {
        let  code = codes[i];
        let result = await getCodeInvestmentReturn(code);
        if (result)
            console.log(result)        
        else 
            console.log(`${code} is out rule`)
    }
}

start()