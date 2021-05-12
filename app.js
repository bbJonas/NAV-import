// required internal librarys
const path = require('path');
const fs = require('fs');
// required external librarys
const xlsx = require('node-xlsx').default;

// Tracked Crypto and FIAT
const crypto = [
  {name: "btc", symbol: 'BITCOINS/USD'},
  {name: "eth", symbol: 'ETHEREUM/USD'},
  {name: "bch", symbol: 'Bitcoin Cash/USD'},
  {name: "ada", symbol: 'Cardano/USD -ADA-'},
  {name: "dash", symbol: 'Dash/USD'}
];
const fiat = [
  {name: "eur", symbol: 'KK EUR'},
  {name: "usd", symbol: 'KK USD'}
];

// Index of crypto and fiat data
var relIndexCrypto = {num: -1, entryValue: 9, value: 10, sharePct: 11};
var relIndexFiat = {num: -1, value: 9, sharePct: 11};

//Index of report date
var relIndexDate = 1

//  find working directory
var appDirectory = path.parse(__filename).dir.normalize();
//set importFolder and array
var importFolder = `${appDirectory}\\import`;
// set array for all report Data
var allData = [];

//look for sheets in importFolder
fs.readdir(importFolder, (err, files) => {
  if (err)
    console.log(err);
  else {
    console.log("\Filenames with the .xlsx extension:");
    files.forEach(file => {
      if (path.extname(file) == ".xlsx")
        console.log(file);
        const wbBuffer = xlsx.parse(fs.readFileSync(`${importFolder}/${file}`,{cellDates:true}));
        const ws = wbBuffer[0].data;
        const flat = ws.flat(2);
        const filtered = flat //.filter(Boolean); removed for consistency
        const indexDate = filtered.findIndex(x => x === 'Datum:') - 1;
        const date = filtered[indexDate];

        const reportData = {
          date: date
        };
        // find and index all fiat from fiat-array in report
        fiat.forEach((fiat, i) => {
          index = filtered.findIndex(x => x === fiat.symbol.toString());
          // if a fiat is found
          if (index != -1) {
            console.log(`found ${fiat.name} with index of: ${index}`);
            // find data by relative index and save to variable
            var num = filtered[index + relIndexFiat.num];
            var value = filtered[index + relIndexFiat.value];
            var sharePct = filtered[index + relIndexFiat.sharePct];
            // put variables into reportData Obj
            reportData[fiat.name] = {num: num, value: value, sharePct: sharePct};
          } else {
            console.log(`missing: ${fiat.name}`);
          }
        });

        crypto.forEach((coin, i) => {
          // Find index of coins from crypto-array in report
          index = filtered.findIndex(x => x === coin.symbol.toString());
          // If a coin is found
          if (index != -1) {
            console.log(`found ${coin.name} with index of: ${index}`);
            // find data by relative index and save to variable
            var num = filtered[index + relIndexCrypto.num];
            var entryValue = filtered[index + relIndexCrypto.entryValue];
            var value = filtered[index + relIndexCrypto.value];
            var sharePct = filtered[index + relIndexCrypto.sharePct];
            var entryPrice = entryValue / num;
            var profitPct = value / entryValue * 100 - 100;
            // put variables into reportData Obj
            reportData[coin.name] = {num: num, entryPrice: entryPrice, entryValue: entryValue, value: value, profitPct: profitPct, sharePct: sharePct};
          } else {
            console.log(`missing: ${coin.name}`);
          }
        });


        //log reportData of at the End of iterating thorugh file
        console.log(reportData);
    })
  }
})
