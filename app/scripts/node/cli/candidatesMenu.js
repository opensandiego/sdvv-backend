'use strict';
const inquirer = require('inquirer');

const update = require('./update');
const query = require('./query');
const menuUtil = require('./menuUtil');


async function mainMenu() {
  const agenciesInDB = await query.getAgencies();
  const agenciesWithElections = await query.getAgencyElections();
  const combinedAgencies = menuUtil.combineAgencies(agenciesWithElections, agenciesInDB);
  const sortedAgencies= menuUtil.sortAgencies(combinedAgencies);
  const agencyElections = menuUtil.getAgenciesMenu(sortedAgencies);

  const moreOptions = [{
    name: `Return to previous menu`,
    value: 'previousMenu',
  }];

  const choicesList = [].concat(
    moreOptions,
    new inquirer.Separator(),
    agencyElections,
    new inquirer.Separator(),
  );

  const prompt = [{
    type: "list",
    name: "electionsMenu",
    message: "Agencies - To add candidates choose agency -> election ",
    choices: choicesList,
    pageSize: 10,
  }];

  const answers = await inquirer.prompt(prompt);

  if (answers.electionsMenu === "previousMenu") {
    return false;
  } else {

    const found = agencyElections.find( item => item.value === answers.electionsMenu);
    if (found) {
      await menuUtil.menuLoop(listElections, [found.value]);
    }
  }

  return true;
}

async function listElections(shortName) {
  const electionsInDB = await query.getElectionsFromDB(shortName);
  const electionsFromNetFile = await query.getElections(shortName, false);
  
  const combinedElections = menuUtil.combineElections(electionsInDB, electionsFromNetFile);
  const sortedElections = menuUtil.sortElections(combinedElections);
  const electionChoices = menuUtil.getElectionsMenu(sortedElections);

  const previousMenuOption = {
    name: `Return to previous menu`,
    value: 'previousMenu',
  };

  const getUpdatedElectionsOption = {
    name: `Update list of elections for ${shortName} from NetFile.`,
    value: 'updateElections',
  };

  const choicesList = [].concat(
    previousMenuOption,
    new inquirer.Separator(),
    electionChoices,
    new inquirer.Separator(),
    getUpdatedElectionsOption,
  );

  const prompt = [{
    type: "list",
    name: "menu",
    message: "Candidates by elections menu",
    choices: choicesList,
    pageSize: 10,
    loop: false,
  }];

  const answers = await inquirer.prompt(prompt);

  if (answers.menu === "previousMenu") {
    return false;
  } else if (answers.menu === "updateElections") {
    if (await confirmationMenu("Update list of elections, may take 10 - 30 seconds?")) {
      await query.getElections(shortName, true);
    }
  } else {

    const found = electionChoices.find( election => election.value === answers.menu);
    if (found) {
      if (await confirmationMenu("Update candidates for election, may take 1 - 3 minutes?")) {
        console.log(`Retrieving ${shortName} candidates for: ${found.value} ...`);
        await update.updateElections(found.value, shortName);
      }
    }

  }

  return true;
}

async function confirmationMenu(message) {

  const prompt = [{
    type: "confirm",
    name: "doUpdate",
    message: message,
    default: false,
  }];

  const answers = await inquirer.prompt(prompt); 
  return answers.doUpdate;
}


async function menu() {
  await menuUtil.menuLoop(mainMenu);
}

module.exports = {
  menu,
}
