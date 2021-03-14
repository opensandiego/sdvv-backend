'use strict';

const { 
  db,
  AgencyModel,
  ElectionModel,
  CandidateModel,
  murmurhash,
  doesTableExist, 
  updateInstancesInModel, 
} = require('../shared.data');
const { electionCycleTitles } = require('../../netfile/publicPortalWebScraper');


function getOfficeCount(election) {
  let officeCount = 0;
  if (election.Candidates) {
    const offices = new Set(election.Candidates.map(candidate => candidate.fullOfficeName ));
    officeCount = offices.size;
  }
  return officeCount
}

// updates
/**
 * @param {string} agencyShortName - Example: "CSD"
 */
 async function updateElections(agencyShortName) {

  const electionTitles = await electionCycleTitles(agencyShortName);

  if (!electionTitles) { return false; }

  const elections = electionTitles.map(electionTitle => ({
    id: murmurhash.v3(`${agencyShortName}:${electionTitle}`),
    agencyShortName: agencyShortName,
    fullElectionTitle: electionTitle,
  }));

  await updateInstancesInModel(elections, ElectionModel);

  return true;
}

// queries
/**
 * Returns elections with summaries 
 * @param {string} agencyShortName - Example: "CSD"
 * @returns {object[]}
 */
async function getElectionsFromDB(agencyShortName) {

  const agency = await AgencyModel.findOne({
    where: { shortcut: agencyShortName, },
    include: {
      model: ElectionModel,
      include: {
        model: CandidateModel,
      },
    },
    order: [
      [{model: ElectionModel}, 'electionDate', 'DESC'],
    ],
  });

  const results = agency.Elections.map(election => {
    return {
      fullElectionTitle: election.fullElectionTitle,
      candidatesCount: election.Candidates ? election.Candidates.length : 0,
      officesCount: getOfficeCount(election),
      inDB: election.Candidates.length > 0 ? true : false,
    }
  });

  return results;
}


/**
 * @param {string} agencyShortName - Example: "CSD"
 * @returns {Date}
 */
 async function getElectionLastUpdate(agencyShortName) {

  const tableExists = await doesTableExist(ElectionModel);
  
  if (!tableExists) { return 'n/a' ; }

  const result = await ElectionModel.max(
    'updatedAt', {
      where: {
        agencyShortName: agencyShortName
      }
    }
  );

  return (result === 0) ? 'n/a' : (new Date(result)).toLocaleDateString();
}


module.exports = {
  getElectionsFromDB,
  getElectionLastUpdate,
  updateElections,
}
