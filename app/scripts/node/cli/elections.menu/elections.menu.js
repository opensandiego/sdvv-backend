'use strict';
const inquirer = require('inquirer');

const { 
  getElectionsFromDB, 
  getElectionLastUpdate, 
  updateElections,
} = require('./elections.menu.data');

const { 
  menuLoop, 
  getElectionsMenu, 
} = require('./elections.menu.helpers');

const { confirmationMenu } = require('../shared.menu');
const candidatesMenu = require('../candidates.menu/candidates.menu');

async function mainMenu(shortName) {
  
  const lastUpdate = await getElectionLastUpdate(shortName);
  const electionsInDB = await getElectionsFromDB(shortName);
  const electionChoices = getElectionsMenu(electionsInDB);

  const previousMenuOption = {
    name: `Return to previous menu`,
    value: 'previousMenu',
  };

  const getUpdatedElectionsOption = {
    name: `Update list of elections for ${shortName} from NetFile` +
      ` (last update: ${lastUpdate})`,
    value: 'updateElections',
  };

  const choicesList = [].concat(
    previousMenuOption,
    new inquirer.Separator(),
    electionChoices,
    (electionChoices.length > 0) ? new inquirer.Separator() : [],
    getUpdatedElectionsOption,
  );

  const prompt = [{
    type: "list",
    name: "menu",
    message: "Elections",
    choices: choicesList,
    default: 'previousMenu',
    pageSize: 10,
    loop: false,
  }];

  const answers = await inquirer.prompt(prompt);

  switch (answers.menu) {
    case "previousMenu":
      return false;
    case "updateElections":
      const confirmationText =
        "Update list of elections, may take 10 - 30 seconds?";
      if (await confirmationMenu(confirmationText)) {
        await updateElections(shortName);
      }
      break;
    default:
      const found = electionChoices
        .find(election => election.value === answers.menu);
      if (found) {
        await candidatesMenu.showMenu(found.value, shortName);
      }
  }

  return true;
}


async function showMenu(...args) {
  await menuLoop(mainMenu, args);
}

module.exports = {
  showMenu,
}
