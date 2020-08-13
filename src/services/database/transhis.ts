import * as Modules from '../../modules'
export class TransHis {
    static async update(transHis: Modules.Database.TransHis, code: string, date: Date, records: Modules.Database.ITransHisRecord[]) {
        let db = transHis.getTransHisDB(code, date);
        db.set(transHis.getTransHisKey(code), records).write();
    }

    static async calCodeInvestParams(transHis: Modules.Database.TransHis, code: string, investment: Modules.Dts.IInvestment ): Promise<Modules.Dts.IInvestParams> {
        let incomes: Modules.Dts.IInterval[] = [];
        investment.handleVolume = investment.handleVolume || Modules.Dts.SHHandleVolume;
        let prices = await transHis.database.chddata.getCodePrices(code);       
        let handles = 0;

        if (!prices || !prices.high) return;

        while(true) {
            handles++;
            let volume = handles * investment.handleVolume;
            let value = volume * prices.average;
            if (value > investment.capital.max) break;

            let income = {  min: investment.income.min / value, 
                            max: investment.income.max / value,
                            mid: (investment.income.min + investment.income.max) / 2 / value,
                            vol: volume,
                            val: value };    
            incomes.push(income);
        }

        
        let getCloserIncome = (baseRate: number, income1: Modules.Dts.IInterval, income2?: Modules.Dts.IInterval )  => {
            let result: Modules.Dts.IInterval;
            income2 = income2 || income1;
            let rateMax1 = Math.abs(income1.max - baseRate);
            let rateMid1 = Math.abs(income1.mid - baseRate);
            let rateMin1 = Math.abs(income1.min - baseRate);
            let rateMax2 = Math.abs(income2.max - baseRate);
            let rateMid2 = Math.abs(income2.mid - baseRate);
            let rateMin2 = Math.abs(income2.min - baseRate);            

            let rate1 = Math.min(rateMax1, rateMid1, rateMin1);
            let rate2 = Math.min(rateMax2,rateMid2, rateMin2);
            if (rate1 <= rate2) {
                result = Object.assign({}, income1);
                result.curr = rateMax1 < rateMid1 ? income1.max : rateMid1 < rateMin1 ? income1.mid : income1.min;
            } else {
                result = Object.assign({}, income2)
                result.curr = rateMax2 < rateMid2 ? income2.max : rateMid2 < rateMin2 ? income2.mid : income2.min;
            }

            return result;
        }


        let _baseRate = (investment.income.min + investment.income.max) / (investment.capital.min + investment.capital.max); 
        let currIncome = null;

        incomes.forEach(income => {
            currIncome = getCloserIncome(_baseRate, income, currIncome);
        })

        if (currIncome) {
            let result: Modules.Dts.IInvestParams = {
                prices: prices,
                step: {price: prices.average * currIncome.curr, volume: currIncome.vol}            
            }
            if (investment.maxCapital) {
                let capital = 0;
                let points = this.getCodePricePoints(transHis, code, result).sort((a, b) => {return a - b});
                
                for (let i = 0; i < points.length; i++) {
                    let point = points[i];
                    capital = capital + point * result.step.volume;
                    if (capital >= investment.maxCapital) {
                        result.prices.sechigh = point;
                        break;
                    }                    
                }
            }
    
            return result;
        }
        
    }

    static getCodePricePoints(transHis: Modules.Database.TransHis, code: string, investParms: Modules.Dts.IInvestParams): number[] {
        let low = investParms.prices.average;
        while(low > investParms.prices.low) {
            low = low - investParms.step.price;
        }
        let point  = low  + investParms.step.price;
        point = Math.round(point * 100) / 100;
        

        let result: number[] = [];
        
        while (point <= (investParms.prices.sechigh || investParms.prices.high)) {
            result.push(point);
            point = point + investParms.step.price;
            point = Math.round(point * 100) / 100;
        }
        return result;
    }
    
    
    static initCodePriceHoldPoints(transHis: Modules.Database.TransHis, code: string, investParms: Modules.Dts.IInvestParams, currPrice): Modules.Dts.IPriceHoldPoints {
        let result = {};
        let points = this.getCodePricePoints(transHis, code, investParms).sort((a, b) => {return a - b});
        for (let i = 0; i < points.length; i++) {
            let point = Math.round(points[i] * 100.0) / 100.0;
            result[point] = (i < points.length - 1) && (point >= currPrice) && false;            
        }

        return result;
    }


    static tryCodeBuyPricePoint(transHis: Modules.Database.TransHis, code: string, holdPoints: Modules.Dts.IPriceHoldPoints, currPrice: number ): number[]  {
        let result = [];
        let points = (Object.keys(holdPoints) as any as number[]).sort((a, b) => {return a - b});
        for (let i = 0; i < points.length - 1; i++) {
            let  point = points[i];
            let hold = holdPoints[point];
            if (!hold && point >= currPrice) {
                holdPoints[point] = true;
                result.push(point);
            }            
        }

        return result;
    }

    static tryCodeSalePricePoint(transHis: Modules.Database.TransHis, code: string, holdPoints: Modules.Dts.IPriceHoldPoints, currPrice: number ): number[]  {
        let result = [];
        let points = (Object.keys(holdPoints) as any as number[]).sort((a, b) => {return a - b});
        for (let i = 0; i < points.length - 1; i++) {
            let point = points[i];
            let nextPoint = points[i + 1];
            let hold = holdPoints[point];
            if (hold && currPrice >= nextPoint) {
                holdPoints[point] = false;
                result.push(point);
                // console.log('1111', point, nextPoint, currPrice)
            }  
        }

        return result;
    }    

    static async calCodeInvestmentReturn(transHis: Modules.Database.TransHis, code: string, investParams: Modules.Dts.IInvestParams ): Promise<Modules.Dts.IInvestmentReturn> {
        let result: Modules.Dts.IInvestmentReturn;
        let records = transHis.database.chddata.getData(code);
        let dates = Object.keys(records).reverse();
        let currPrice = 0;
        let holdPoints = null;
        let buyCount = 0;
        let saleCount = 0;


        for (let i = 0; i < dates.length ; i++) {
        // for (let i = 0; i < 50 ; i++) {
            let date = dates[i];
            if (transHis.existTransHisDB(code, new Date(date))) {
                let db = transHis.getTransHisDB(code, new Date(date));
                let details = (db.get("transhis").value() as Array<Modules.Database.ITransHisRecord>).reverse();    
                for (let j = 0; j < details.length; j++) {
                    let detail = details[j];
                    currPrice = detail.price;
                    holdPoints = holdPoints || this.initCodePriceHoldPoints(transHis, code, investParams, currPrice);
                    let buys =  this.tryCodeBuyPricePoint(transHis, code, holdPoints, currPrice);
                    let sales =  this.tryCodeSalePricePoint(transHis, code, holdPoints, currPrice);
                    buyCount = buyCount + buys.length;
                    saleCount = saleCount + sales.length;
                    if (buys.length > 0 || sales.length > 0) {
                        // console.log(`buyCount: ${buyCount} , saleCount: ${saleCount} `)
                    }
                }        
                // console.log(`buyCount: ${buyCount} , saleCount: ${saleCount} `);

            }
        };

        

        
        let income: Modules.Dts.IInvestIncome = {} as any;
        income.buyCount = buyCount;
        income.saleCount = saleCount;
        let points = (Object.keys(holdPoints) as any as number[]).sort((a, b) => {return a - b});
        points.splice(points.length-1);
        points.forEach(point => {
            income.capital = (income.capital || 0) + point * investParams.step.volume;
        })
        income.income = income.saleCount * investParams.step.price * investParams.step.volume;
        income.rate = income.income * 100 / income.capital;



        result = {
            code: code,
            params: investParams,
            points: holdPoints,
            income: income
        }

        return result;
    }
}