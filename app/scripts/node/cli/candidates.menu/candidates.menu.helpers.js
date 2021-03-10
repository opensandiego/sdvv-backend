'use strict';
const chalk = require('chalk');

const { menuLoop, getPaddedColumns } = require('../shared.helpers');


function getCandidatesMenuInColumns(candidates) {
  const headerRow = { fullName: 'Name', fullOfficeName: 'Office' };
  const columnNames = ['fullName', 'fullOfficeName'];

  const { heading, rows } = getPaddedColumns(candidates, headerRow, columnNames);

  const columnSpacer = '  ';
  const headingText = `${chalk.bold.underline(heading.padded.fullName)}${columnSpacer}${chalk.bold.underline(heading.padded.fullOfficeName)}`;

  const rowChoices = rows.map( candidate => {
    return {
      name: `${candidate.padded.fullName}${columnSpacer}${candidate.padded.fullOfficeName}`,
      value: `${candidate.id}`,
      short: `${candidate.fullName}: ${candidate.fullOfficeName}`,
    }
  });

  return { headingText, rowChoices };
}


module.exports = {
  menuLoop,
  getCandidatesMenuInColumns,
}
