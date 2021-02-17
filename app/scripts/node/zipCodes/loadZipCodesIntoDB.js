const zipCodeData = require('./zipCodeData');

const db = require('../../../models/index');
const ZipCodeModel = db.sequelize.models.ZipCode;

function getZipCodes() {
  const file = zipCodeData.loadFromCSVFile();
  return zipCodeData.convertCSVtoJSON(file); 
}

async function createInDB(data) {
  await ZipCodeModel.sync({ force: true });
  await ZipCodeModel.bulkCreate(data);  
}

(async () => {
  const jsonData = getZipCodes();
  await createInDB(jsonData);
})();
