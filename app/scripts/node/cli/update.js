const db = require('../../../models/index');
const AgencyModel = db.sequelize.models.Agency;
const CandidateModel = db.sequelize.models.Candidate;

const netFileAgencies = require('../netfile/netfileAgencies');
const query = require('./query');


/**
 * @param {object|object[]} instances 
 * @param {object} model 
 */
async function updateInstancesInModel(instances, model) {
  instances = Array.isArray(instances) ? instances : [ instances ];

  const tableExits = await query.doesTableExist(model);
  
  if (!tableExits) {
    await model.sync();
  }
  
  for await(instance of instances) {
    await model.upsert(instance);
  }
}

async function updateAgencies() {
  const agencies = await netFileAgencies.getAgencies();
  await updateInstancesInModel(agencies, AgencyModel);
}


/**
 * @param {object|object[]} electionData 
 * @param {string} agencyShortName - Example: "CSD"
 */
function transformCandidateElectionData(electionData, agencyShortName) {
  electionData = Array.isArray(electionData) ? electionData : [ electionData ];

  let candidateData = [];

  electionData.forEach(election => {
    const offices = election.electionItems.find(item => item.name === "Candidates").elements;
    
    offices.forEach(office => {
      
      if (!office.elements) { return; }

      office.elements.forEach(candidate => {

        candidateData.push({
          agencyShortName: agencyShortName,
          fullName: candidate.name,
          fullOfficeName: office.name,
          fullElectionTitle: election.cycle,
        });

      });

    });

  });
  
  return candidateData;
}


/**
 * @param {string} electionTitle - Example: "11/03/2020 General Election"
 * @param {string} shortName - Example: "CSD"
 */
async function updateElections(electionTitle, shortName){
  const netFilePortalScraper = require('../netfile/publicPortalWebScraper');

  const candidates = await netFilePortalScraper.getMultipleElectionCycleCandidates(shortName, electionTitle);

  if (!candidates) { return false; }
  
  const transformedResults = transformCandidateElectionData(candidates, shortName);

  await updateInstancesInModel(transformedResults, CandidateModel);

  return true;
}


module.exports = {
  updateAgencies,
  updateElections,
}
