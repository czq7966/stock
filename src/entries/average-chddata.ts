import * as Modules from '../modules'


let shCodes = Modules.Database.database.codes.getSHCodes();
let shKeys = Object.keys(shCodes);
let codes = [];

for (let i = 0; i < 20; i++) {
    codes.push(shKeys[i]);
}

// codes = ["603993"]
async function main() {
    let prices = await Modules.Database.database.chddata.averagePrices(codes);
    console.log(prices)
}

main()



