// required internal librarys
const path = require('path');
const fs = require('fs');
// required external librarys
const xlsx = require('node-xlsx');

// //  excel workbook
// const wb = xlsx.parse(`${__dirname}/myFile.xlsx`)
//
// // target worksheet
// const ws = ();

//  find working directory
var appDirectory = path.parse(__filename).dir.normalize();
//set importFolder
var importFolder = `${appDirectory}\\import`;
//look for sheets in importFolder
fs.readdir(importFolder, (err, files) => {
  if (err)
    console.log(err);
  else {
    console.log("\Filenames with the .txt extension:");
    files.forEach(file => {
      if (path.extname(file) == ".xlsx")
        console.log(file);
    })
  }
})
