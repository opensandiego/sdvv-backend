const fs = require('fs');

function loadJSONFile(fileName = `jurisdictionZipCodes.json`) {
  const filePath = `${__dirname}/${fileName}`;

  if ( !fs.existsSync(filePath) ) {
    throw `File not found: ${filePath}`;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

module.exports = {
  loadJSONFile,
};
