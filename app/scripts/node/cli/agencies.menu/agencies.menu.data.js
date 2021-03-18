'use strict';

const { 
  AgencyModel,
  ElectionModel,
  doesTableExist, 
  updateInstancesInModel, 
} = require('../shared.data');
const netFileAgencies = require('../../netfile/netfileAgencies');


// updates
async function updateAgenciesFromNetFile() {
  const agencies = await netFileAgencies.getAgencies();
  await updateInstancesInModel(agencies, AgencyModel);
}


// queries
async function getAgenciesWithSummary() {
  const tableExists = await doesTableExist(AgencyModel);
  if (!tableExists) { return []; }

  const agencyInstances = await AgencyModel.findAll({
    attributes: {
      include: [
        'shortcut',
        'name',
      ]
    },
  });

  const agencies = [];

  for await (const instance of agencyInstances) {
    const totalElectionsCount = await instance.countElections();
    const mostRecentElectionDate = await ElectionModel.max(
      'electionDate', {
      where: { 'agencyShortName': instance.shortcut, },
    });

    agencies.push({
      inDB: totalElectionsCount > 0,
      shortName: instance.shortcut,
      name: instance.name,
      electionTitleCount: totalElectionsCount,
      mostRecentElectionDate: (mostRecentElectionDate === 0) 
        ? 'n/a' 
        : mostRecentElectionDate.toLocaleDateString(),
    })

  }

  return agencies;
}

/**
 * @returns  {Date}
 */
async function getAgencyLastUpdate() {
  const tableExists = await doesTableExist(AgencyModel);
    
  if (!tableExists) { return 'n/a' ; }

  const result = await AgencyModel.max('updatedAt');

  return (result === 0) ? 'n/a' : result.toLocaleDateString();
}


module.exports = {
  updateAgenciesFromNetFile,

  getAgenciesWithSummary,
  getAgencyLastUpdate,
}
