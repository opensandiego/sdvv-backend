'use strict';

const { 
  AgencyModel,
  testDatabaseConnection,
  doesTableExist, 
  syncModels, 
  closeDBConnection,
} = require('../shared.data');


async function getAgencyCount() {
  const tableExists = await doesTableExist(AgencyModel);
    
  if (!tableExists) { return 0; }

  return await AgencyModel.count();
}


module.exports = {
  getAgencyCount,
  syncModels,
  testDatabaseConnection,
  closeDBConnection,
}
