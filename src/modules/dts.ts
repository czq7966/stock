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
    investment: IInvestment,
    return: IInterval
    maxCapital?: number,
    prices?: IChdDataCodePrices,
    stepPrice?: number,
    stepVolume?: number,
    stepRate?: number    
}


export interface IInvestParams {
    prices: {high: number, low: number, average: number}
    step: { price: number, volume: number, rate?: number }

}

export interface IPriceHoldPoints {
    [price: string]: boolean
}