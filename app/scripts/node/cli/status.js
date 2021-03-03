'use strict';
const db = require('../../../models/index');
const AgencyModel = db.sequelize.models.Agency;
const query = require('./query');


async function agenciesStatus() {
  const tableExits = await query.doesTableExist(AgencyModel);
  if (!tableExits) { return { count: 0, lastUpdate: 'n/a' }; }

  const agenciesList =  await AgencyModel.findAll({ raw: true });
  const agenciesLastUpdate =  await AgencyModel.max('updatedAt');

  if (agenciesList < 1) { return { count: 0, lastUpdate: 'n/a' }; }

  return { 
    count: agenciesList.length,
    lastUpdate: `${agenciesLastUpdate.toDateString()} on`
      + ` ${agenciesLastUpdate.toLocaleTimeString()}`
   };
}


module.exports = {
  agenciesStatus,
}
