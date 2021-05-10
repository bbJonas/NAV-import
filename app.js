// required internal librarys
const path = require('path');
const fs = require('fs');
// required external librarys
const xlsx = require('node-xlsx').default;


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
        console.log(wbBuffer);
    })
  }
})

importArray.forEach(file => {
  //  excel workbook
  const wbBuffer = xlsx.parse(fs.readFileSync(`${importFolder}/${file}`));
  // target worksheet
  const ws = wbBuffer.Sheets["Holdingsreport"];
  var data = xlsx.utils.sheet_to_json(ws);
  console.log(data);
});
