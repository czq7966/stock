var checkChdData = (code, records, capital, earning, earnRate) => {
        var count = 0;
        var hisHigh = 0;
        var hisLow = 10000;
        var curr = records[0].TCLOSE
        records.forEach(record => {
            if (record.HIGH != 0 && record.LOW != 0) {

                var lclose = record.LCLOSE;
                var high = Math.max(lclose, record.HIGH)
                var low = Math.min(lclose, record.LOW)

                hisHigh = Math.max(hisHigh, high)
                hisLow = Math.min(hisLow, low)

                var needCap = earning / ((high - low) / lclose)
                if (capital - needCap >= 0) {
                    count++;
                }
            } else {
                // console.log(record)
            }
        })
        var rate = count / records.length;
        var step = ( hisLow) * 0.1
        if (rate > earnRate && curr > (hisLow + step) && curr < (hisLow + step * 3) ) {
            console.log(code, rate, hisHigh, hisLow, curr)
        }
}

module.exports = checkChdData;