const fs = require('fs');
const csvParser = require('csv-parser');

function readCsvFile(file, dataHandler, endHandler) {
  fs.createReadStream(file)
    .pipe(csvParser({ separator: ';' }))
    .on('data', dataHandler)
    .on('end', endHandler);
}

module.exports = readCsvFile;
