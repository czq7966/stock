import { IChdDataCodePrices } from "./database";

export var SHHandleVolume = 100;
export var SZHandleVolume = 50;
export interface IInterval {
    min: number,
    max: number,
    mid?: number,
    curr?: number
    vol?: number,
    val?: number
}

export interface IInvestment {
    capital: IInterval,
    income?: IInterval,
    rate?: IInterval,
    handleVolume?: number    
}

export interface IInvestmentReturn {
    code: string,
    name?: string
    params: IInvestParams,
    points: IPriceHoldPoints,
    income: IInvestIncome
}


export interface IInvestParams {
    prices: {high: number, low: number, average: number}
    step: { price: number, volume: number, rate?: number }

}

export interface IInvestIncome {
    buyCount: number,
    saleCount: number,
    capital: number,
    income: number,
    rate: number
}

export interface IPriceHoldPoints {
    [price: string]: boolean
}