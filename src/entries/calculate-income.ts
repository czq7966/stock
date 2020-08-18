import * as Modules from '../modules'
import * as Services from '../services'



async function start() {
    let investment: Modules.Dts.IInvestment = {maxCapital:50000, capital: {min:3800, max:4200}, income:{min:80, max:120}};
    let codes = Object.keys(Modules.Database.database.codes.getSHCodes());
    Modules.Database.database.incomes.resetCSV();
    for (let i = 0; i < 100; i++) {
        let  code = codes[i];
        let res = await Services.Database.TransHis.getCodeInvestmentReturn(code, investment);
        if (res) {
            Modules.Database.database.incomes.setDataAndCSV(res.code, res);
            console.log(code)        
        }
        else 
            console.log(`${code} is out rule`)
    }
    // await Modules.Database.database.incomes.exportToCSV()
}

start()