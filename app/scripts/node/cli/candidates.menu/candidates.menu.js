'use strict';
const inquirer = require('inquirer');
const chalk = require('chalk');

const {
  menuLoop,
  getCandidatesMenuInColumns,
} = require('./candidates.menu.helpers');

const {
  updateCandidates,
  getCandidates,
  getCandidatesLastUpdate,
} = require('./candidates.menu.data');

const { confirmationMenu } = require('../shared.menu');


async function mainMenu(electionTitle, shortName) {

  const candidates = await getCandidates(electionTitle, shortName);
  const { headingText, rowChoices } = await getCandidatesMenuInColumns(candidates);

  const candidatesLastUpdate = await getCandidatesLastUpdate(electionTitle, shortName);

  console.log(`List of candidates with ${chalk.bold(shortName)} for ${chalk.italic(electionTitle)}`);

  const previousMenuOption = {
    name: `Return to previous menu`,
    value: 'previousMenu',
  };

  const getUpdatedCandidatesOption = {
    name: `Update list of candidates from NetFile.` +
      ` (last update: ${candidatesLastUpdate})`,
    value: 'updateCandidates',
  };

  const choicesList = [].concat(
    previousMenuOption,
    (rowChoices.length > 0) ? new inquirer.Separator() : [],
    (rowChoices.length > 0) ? new inquirer.Separator(headingText) : [],
    rowChoices,
    (rowChoices.length > 0) ? new inquirer.Separator() : [],
    getUpdatedCandidatesOption,
  );

  const prompt = [{
    type: "list",
    name: "menu",
    message: "Candidates for election ",
    choices: choicesList,
    default: 'previousMenu',
    pageSize: 10,
    loop: false,
  }];

  const answers = await inquirer.prompt(prompt);

  switch (answers.menu) {
    case "previousMenu":
      return false;
    case "updateCandidates":
      const confirmationText =
        "Update candidates, may take 1 - 3 minutes?";
      if (await confirmationMenu(confirmationText)) {
        console.log(`Retrieving ${shortName} candidates for: ${electionTitle} ...`);
        await updateCandidates(electionTitle, shortName);
      }
      break;
    default:
  }

  return true;
}


async function showMenu(...args) {
  await menuLoop(mainMenu, args);
}

module.exports = {
  showMenu,
}
