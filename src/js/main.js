require('./date-format')
const Lowdb =  require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = Lowdb(adapter);


var getChdData = require('./get-chd-data')
var checkChdData = require('./check-chd-data')


var CalDays = 365 * 1;
var CapHigh = 5000;
var capLow  = 3000; 
var Capital = 4000;
var Earning = 100;
var EarnRate = 0.7;

db.defaults({code: {}, data: {}});





var StartNow = new Date(new Date().setDate(new Date().getDate() - CalDays))
var EndNow = new Date()
var StartDate = StartNow.Format('yyyyMMdd')
var EndDate = EndNow.Format('yyyyMMdd')




var Lists = require('./ha-lists.js');
Codes = Object.keys(Lists)

// var Codes = ['0603993', '0600069']
// var Codes = ['0600745']
Codes.forEach(async (code) => {    
    code = '0000000' + code;
    code = code.substr(code.length - 7)
    var records = await getChdData(code, StartDate, EndDate)
    checkChdData(code, records, Capital, Earning, EarnRate)

})
