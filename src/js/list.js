const browser = await puppeteer.launch({timeout: 120});

const page = await browser.newPage();
var Lists = {}


var _getLists = async (code, pageIdx) => {
    var pageIdx = pageIdx || 1;
    var url = 'http://app.finance.ifeng.com/list/stock.php?t={code}&f=chg_pct&o=desc&p={page}';
    // http://app.finance.ifeng.com/list/stock.php?t=hs&f=chg_pct&o=desc&p=2
    url = url.replace('{code}', code).replace('{page}', pageIdx);
    try {
        await page.goto(url);        
    } catch (error) {
        try {
            await page.goto(url);                    
        } catch (error) {
            try {
                await page.goto(url);                    
            } catch (error) {
                await page.goto(url);                    
            }                            
        }
        
    }
    

    const data = await page.$$eval('table tr td a', tds => tds.map((td) => {
      return td.innerHTML;
    }));
    
    
    var i = 0;
    var count = 0;

    while (i < data.length) {
        var key = data[i++]
        var value = data[i++]
    
        if (parseInt(key)) {
            Lists[key] = value
            console.log(`"${key}":"",`)
            count++;
        }    
    }

    if (count > 0 ) {
        await _getLists(code, pageIdx + 1)
    }
    

}

var getLists = async (code, pageIdx) => {
    console.log(`module.exports = ${code}Lists;`)
    console.log(`export var ${code}Lists = {`);
    await _getLists(code)
    console.log(`}`)
}

await getLists('ha')


// await getLists('sa')
console.log(Object.keys(Lists).length)



await browser.close();
