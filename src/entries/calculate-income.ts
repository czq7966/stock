import * as Modules from '../modules'
import * as Services from '../services'



async function start() {
    let investment: Modules.Dts.IInvestment = {maxCapital:50000, capital: {min:3800, max:4200}, income:{min:80, max:120}};
    let codes = Object.keys(Modules.Database.database.codes.getSHCodes());
    try {    
        for (let i = 0; i < 500; i++) {
            let  code = codes[i];
            let res = Modules.Database.database.incomes.getData(code) ||  await Services.Database.TransHis.getCodeInvestmentReturn(code, investment);
            if (res) {
                Modules.Database.database.incomes.setData(res.code, res);
                console.log(code)        
            }
            else 
                console.log(`${code} is out rule`)
        }
    } finally {
        // Modules.Database.database.incomes.resetCSV();        
        await Modules.Database.database.incomes.exportToCSV()
    }
}

start()