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
var relIndexCrypto = {num: -1, entryValue: 5, value: 6, percent: 7};
var relIndexFiat = {num: -1, value: 3, percent: 4};

//Index of report date
var relIndexDate = 1

//  find working directory
var appDirectory = path.parse(__filename).dir.normalize();
//set importFolder and array
var importFolder = `${appDirectory}\\import`;
var importArray = [];

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
        const filtered = flat.filter(Boolean);
        const indexDate = filtered.findIndex(x => x === 'Datum:') - 1;
        const date = filtered[indexDate];

        const reportData = {
          date: date
        };

        crypto.forEach((coin, i) => {
          // Find index of coins from crypto-array in report
          index = filtered.findIndex(x => x === coin.symbol.toString());
          // If a coin is found
          if (index != -1) {
            console.log(`found ${coin.name} with index of: ${index}`);
            // find data by relative index and save to variable
            var num = filtered[index + relIndexCrypto.num];
            var entryValue = filtered[index + relIndexCrypto.entryValue]
            var value = filtered[index + relIndexCrypto.value]
            var percent = filtered[index + relIndexCrypto.percent]
            // put variables into reportData Obj
            reportData[coin.name] = {num: num, entryValue: entryValue, value: value, percent: percent};
          } else {
            console.log(`missing: ${coin.name}`);
          }

        });
        //log reportData of at the End of iterating thorugh file
        console.log(reportData);
    })
  }
})

// importArray.forEach(file => {
//   //  excel workbook
//   const wbBuffer = xlsx.parse(fs.readFileSync(`${importFolder}/${file}`));
//   // target worksheet
//   const ws = wbBuffer.Sheets["Holdingsreport"];
//   var data = xlsx.utils.sheet_to_json(ws);
//   console.log(data);
// });
