'use strict';
const db = require('../models/index');
const AgencyModel = db.sequelize.models.Agency;
const ElectionModel = db.sequelize.models.Election;
const CandidateModel = db.sequelize.models.Candidate;


/**
 * @param {string} agencyShortName - example  'CSD'
 * @param {string} officeName - example 'City Council San Diego - Dist 1'
 */
 function getOfficeSeatPerAgency(agencyShortName, officeName) {

  switch (agencyShortName.toLocaleUpperCase()) {
    case 'CSD':
      const csd_district_source_name = 'DIST';
      const csd_district_destination_name = 'district';

      if (!officeName.includes('-')) { return null; }

      const [ _ignore, seatStr ] = officeName.split('-'); 
      const [ type, name ] = seatStr.trim().toLocaleUpperCase().split(' ');

      let seatNameParsed = Number.parseInt(name);

      if (!type.includes(csd_district_source_name) || Number.isNaN(seatNameParsed)) {   
        return null;
      }

      return { type: csd_district_destination_name, name: name.toString() };

    default:
      return null;
  }

}

/**
 * @param {string} agencyShortName - example  'CSD'
 * @param {string} year 
 * @returns {string[]}
 */
async function getCandidateIDsOfAgencyInYear(agencyShortName, year) {
  const agency = await AgencyModel.findOne({
    where: {
      shortcut: agencyShortName,
    },
    include: {
      model: ElectionModel,
      where: {
        electionYear: year,
        electionType: ['General', 'Primary'],
      },
      include: {
        model: CandidateModel,
      }
    },
  });

  if (!agency || !agency.Elections) {
    return [];
  };

  const candidateIds = agency.Elections
    .map( election => election.Candidates.map( candidate => candidate.id ))
    .flat();

  return candidateIds;
}

/**
 * @param {string[]} candidateIds 
 */
async function getCandidatesByIDs(candidateIds) {

  const { Op } = require("sequelize");
  const candidates = await CandidateModel.findAll({
    attributes: [
      "id", 
      "fullName",
      "fullOfficeName",
      'officeType',
      "vvInGeneralElection"],
    where: {
      [Op.and]: [
        { id: candidateIds },
        { officeType: { [Op.not]: null } },
      ],
    },
    order: [
      [ 'fullOfficeName', 'DESC' ],
      [ 'vvInGeneralElection', 'DESC' ],
      [ 'vvLastName', 'ASC' ],
    ],
    raw: true,
  });

  return candidates;
}

async function getAllCandidatesOfAgencyInYear(req, res) {

  const agencyShortName = req.params.agencyShortName.toLocaleUpperCase();
  const year = req.params.year;

  try {
    const candidateIds = await getCandidateIDsOfAgencyInYear(agencyShortName, year);

    if (candidateIds.length < 1) { 
      res.status(404).send("No Candidates found for given Agency and Year combination"); 
      return;
    }

    const candidates = await getCandidatesByIDs(candidateIds);

    candidates.forEach(candidate => {
      candidate.seat = getOfficeSeatPerAgency(agencyShortName, candidate.fullOfficeName);
    });

    res.setHeader('Content-Type', 'application/json');
    res.status(201).send(JSON.stringify(candidates));

  } catch(error) {
    console.log(error);
    res.status(500).send(error);
  }

}

module.exports = {
  getAllCandidatesOfAgencyInYear,
}
