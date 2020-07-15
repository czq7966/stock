require('./date-format')
var getChdData = require('./get-chd-data')
var checkChdData = require('./check-chd-data')


var CalDays = 365 * 1;
var Capital = 3000;
var Earning = 100;
var EarnRate = 0.7;





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
