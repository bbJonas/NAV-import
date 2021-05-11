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
        crypto.forEach((coin, i) => {
          index = filtered.findIndex(x => x === coin.symbol.toString());
          console.log(coin.symbol);
          console.log(index);
        });

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
