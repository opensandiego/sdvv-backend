const jurisdictionData = require('./jurisdictionData');

const db = require('../../../models/index');
const JurisdictionModel = db.sequelize.models.Jurisdiction;

async function createInDB(data) {
  await JurisdictionModel.sync({ force: true });
  await JurisdictionModel.bulkCreate(data);
}

(async () => {
  const jsonData = jurisdictionData.loadJSONFile();
  await createInDB(jsonData);
})();
 