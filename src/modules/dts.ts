export interface IInterval {
    min: number,
    max: number
}

export interface IInvestment {
    capital: IInterval,
    income?: IInterval,
    rate?: IInterval
}

export interface IInvestmentReturn {
    capital: IInterval,
    stepPrice?: number,
    stepRate?: number    
}