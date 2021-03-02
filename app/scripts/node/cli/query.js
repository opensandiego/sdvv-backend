'use strict';
const db = require('../../../models/index');
const AgencyModel = db.sequelize.models.Agency;
const CandidateModel = db.sequelize.models.Candidate;
const Sequelize = require('sequelize');
const netFilePortalScraper = require('../netfile/publicPortalWebScraper');


async function doesTableExist(model) {
  let exists = true;

  try {
    await model.findAll();
  } catch(error) {
    if (error instanceof Sequelize.DatabaseError) {
      exists = false;
    } else {
      throw error;
    }
  }

  return exists;
}

async function getAgencies() {
  const tableExits = await doesTableExist(AgencyModel);
    
  if (!tableExits) { return []; }

  return await AgencyModel.findAll({ raw: true, });
}

/**
 * @param {string} agencyShortName - Example: "CSD"
 * @param {boolean} [forceUpdate = true]
 */
async function getElections(agencyShortName, forceUpdate = true){
  getElections.shortNameElectionsCache = getElections.shortNameElectionsCache || new Map();

  const elections = getElections.shortNameElectionsCache.get(agencyShortName);
  if (elections) {
    return elections;
  } else if (!forceUpdate) {
    return [];
  }

  const results = await netFilePortalScraper.electionCycleTitles(agencyShortName);

  getElections.shortNameElectionsCache.set(agencyShortName, results);

  return results;
}

async function getAgencyElections() {

  const results = await CandidateModel.findAll({
    attributes: [ 
      'agencyShortName',
      [Sequelize.literal('COUNT(DISTINCT("fullElectionTitle"))'), 'electionTitleCount'],
      [Sequelize.fn('MAX', Sequelize.col('vvElectionDate')), 'mostRecentElectionDate'],
    ],
    include: [ { model: AgencyModel, attributes: ['name'] } ],
    group: [ 'agencyShortName', 'name', ], 
    raw: true,
  })
  
  return results;
}


/**
 * @param {string} agencyShortName - Example: "CSD"
 */
async function getElectionsFromDB(agencyShortName) {
  const results = await CandidateModel.count({
    col: ['fullOfficeName'],
    distinct: true,
    group: ['fullElectionTitle'],
    where: { 'agencyShortName': agencyShortName },
    raw: true,
    attributes: [
      'fullElectionTitle',
      [Sequelize.fn('COUNT', Sequelize.col('fullName')), 'candidatesCount'],
      [Sequelize.fn('MAX', Sequelize.col('updatedAt')), 'lastUpdated'],
      [Sequelize.fn('MAX', Sequelize.col('vvElectionDate')), 'electionDate'],
    ]
  });

  return results;
}


module.exports = {
  doesTableExist,
  getAgencies,
  getElections,
  getAgencyElections,
  getElectionsFromDB,
}
