const fs = require('fs');
var csv_json = require('csvjson');

function loadFromCSVFile(fileName = `zip_code_database.csv`) {
  const filePath = `${__dirname}/${fileName}`;

  if ( !fs.existsSync(filePath) ) {
    throw `File not found: ${filePath}`;
  }

  return fs.readFileSync(filePath, 'utf8' );
}

function convertCSVtoJSON( csvData ) {
  var options = {
    delimiter : ',',
    quote     : '"'
  };
  
  return csv_json.toObject(csvData, options);
}

module.exports = {
  loadFromCSVFile,
  convertCSVtoJSON,
};
