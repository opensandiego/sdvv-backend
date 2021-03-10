'use strict';
const chalk = require('chalk');

const { menuLoop, getPaddedColumns } = require('../shared.helpers');


function sortAgencies(agencies) {

  let sorted = agencies.sort((a, b) => a.name.localeCompare(b.name));
  sorted = sorted.sort((a, b) => (a.inDB === b.inDB)? 0 : a.inDB ? -1 : 1);

  return sorted
}

function formatAgencyNames(agencies) {
  let newAgencies = [...agencies];

  newAgencies = newAgencies.map(agency => {
    let agencyName = `${agency.name}`;

    if (agency.name.includes(',')) {
      const [ last, first, ...extra ] = agency.name.split(',');
      agencyName = `${first.trim()} ${last.trim()}` + `${extra}`;
    }
    agency.formattedName = agencyName;

    return agency;
  });

  return newAgencies;
}

function getAgenciesMenuInColumns(agencies) {
  const headerRow = { 
    shortName: 'AgencyID',
    formattedName: 'Agency Name',
    electionTitleCount: 'Elections',
    mostRecentElectionDate: 'Most recent election' };
  const columnNames = [ 'shortName', 'formattedName', 'electionTitleCount', 'mostRecentElectionDate' ];

  let newAgencies = formatAgencyNames(agencies);

  const { heading, rows } = getPaddedColumns(newAgencies, headerRow, columnNames);

  const columnSpacer = '  ';
  const headingText = 
    `${chalk.bold.underline(heading.padded.shortName)}`
    + `${columnSpacer}${chalk.bold.underline(heading.padded.formattedName)}`
    + `${columnSpacer}${chalk.bold.underline(heading.padded.electionTitleCount)}`
    + `${columnSpacer}${chalk.bold.underline(heading.padded.mostRecentElectionDate)}`;

  const rowChoices = rows.map(agency => {

    const nameSuffix = agency.inDB 
      ? `${columnSpacer}${agency.padded.electionTitleCount}` 
        + `${columnSpacer}${agency.padded.mostRecentElectionDate}` 
      : '';

    return {
      name: `${agency.padded.shortName}${columnSpacer}`
        + `${agency.padded.formattedName}${nameSuffix}`,
      value: `${agency.shortName}`,
      short: `${agency.shortName}, ${agency.formattedName}`
    }
  });

  return { headingText, rowChoices };  
}


module.exports = {
  menuLoop,
  sortAgencies,
  getAgenciesMenuInColumns,
}
