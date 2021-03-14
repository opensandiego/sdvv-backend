'use strict';

const {
  ElectionModel,
  CandidateModel,
  murmurhash,
} = require('../shared.data');
const { getMultipleElectionCycleCandidates } = require('../../netfile/publicPortalWebScraper');


/**
 * @param {object|object[]} electionData 
 * @returns {object[]} candidateData
 * @returns {string} candidateData.fullName
 * @returns {string} candidateData.fullOfficeName
 * @returns {string} candidateData.fullElectionTitle
 */
 function transformCandidateElectionData(electionData) {
  electionData = Array.isArray(electionData) ? electionData : [ electionData ];

  let candidateData = [];

  electionData.forEach(election => {
    const offices = election.electionItems.find(item => item.name === "Candidates").elements;
    // ANA candidates for: 11/08/2022 General Election
    // (node:2128) UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'find' of undefined
    // at C:\Users\user\Documents\dev\GitHub\OpenSanDiego\sdvv-backend\app\scripts\node\cli\candidates.menu\candidates.menu.data.js:26:44
    offices.forEach(office => {
      
      if (!office.elements) { return; }

      office.elements.forEach(candidate => {

        candidateData.push({
          fullName: candidate.name,
          fullOfficeName: office.name,
          fullElectionTitle: election.cycle,
        });

      });

    });

  });
  
  return candidateData;
}

// updates
/**
 * @param {string} electionTitle - Example: "11/03/2020 General Election"
 * @param {string} shortName - Example: "CSD"
 */
async function updateCandidates(electionTitle, shortName) {
  const candidatesFromNetFile = await getMultipleElectionCycleCandidates(shortName, electionTitle);
  if (!candidatesFromNetFile) { return false; }

  const transformedResults = transformCandidateElectionData(candidatesFromNetFile);

  const election = await ElectionModel.findOne({
    where: { agencyShortName: shortName, fullElectionTitle: electionTitle, },
  });

  if (!election) { return false; }

  for await(const candidate of transformedResults) {
    const candidateId = murmurhash
      .v3(`${shortName}:${election.electionYear}:${candidate.fullOfficeName}:${candidate.fullName}`); 
    const instance = {
      id: candidateId,
      fullName: candidate.fullName,
      fullOfficeName: candidate.fullOfficeName,
      agencyShortName: shortName,
    };

    if (election.electionType === 'General') {
      instance.vvInGeneralElection = true;
    }

    await CandidateModel.upsert(instance);
    const candidateInstance = await CandidateModel.findByPk(candidateId);

    await candidateInstance.addElection(election);
  }

  election.candidatesLastUpdated = new Date();
  await election.save();

  return true;
}
 
// queries
async function getCandidates(electionTitle, shortName) {
  const election = await ElectionModel.findOne({
    where: { agencyShortName: shortName, fullElectionTitle: electionTitle, },
 });
 if (!election) { return []; }

 const results = await election.getCandidates({
  order: [
    ['fullOfficeName', 'ASC'],
    ['vvLastName', 'ASC'],
  ],
 });

 return results;
}

async function getCandidatesLastUpdate(electionTitle, shortName) {
  const election = await ElectionModel.findOne({
    where: { agencyShortName: shortName, fullElectionTitle: electionTitle, },
  });

  if (!election || !election.candidatesLastUpdated) { return 'n/a'; }

  return (new Date(election.candidatesLastUpdated)).toLocaleDateString();
}


module.exports = {
  updateCandidates,
  getCandidates,
  getCandidatesLastUpdate,
}
