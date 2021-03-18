'use strict';
const inquirer = require('inquirer');

const {
  sortAgencies,
  menuLoop,
  getAgenciesMenuInColumns,
} = require('./agencies.menu.helpers');

const {
  updateAgenciesFromNetFile,
  getAgenciesWithSummary,
  getAgencyLastUpdate,
} = require('./agencies.menu.data');

const electionsMenu = require('../elections.menu/elections.menu');


async function updateAgencies(){
    
  try {
    await updateAgenciesFromNetFile();
  } catch(e) {
    console.log('Error updating agencies from NetFile API.');
    console.log(e);
    return;
  }

}

async function getAgencyList(){
  const agencies = await getAgenciesWithSummary();
  const sortedAgencies = sortAgencies(agencies);
  
  return getAgenciesMenuInColumns(sortedAgencies);
}


async function mainMenu() {

  const { headingText, rowChoices } = await getAgencyList();
  const agencyLastUpdate = await getAgencyLastUpdate();

  const previousMenuOption = {
    name: `Return to previous menu`,
    value: 'previousMenu',
  };

  const getUpdatedAgenciesOption = {
    name: "Update Agencies from NetFile" + 
      ` (last update: ${agencyLastUpdate})`,
    value: 'updateTable',
  };

  const choicesList = [].concat(
    previousMenuOption,
    (rowChoices.length > 0) ? new inquirer.Separator() : [],
    (rowChoices.length > 0) ? new inquirer.Separator(headingText) : [],
    rowChoices,
    (rowChoices.length > 0) ? new inquirer.Separator() : [],
    getUpdatedAgenciesOption,
  );

  const prompt = [{
    type: "list",
    name: "menu",
    message: "Agencies - To add candidates choose agency -> election ",
    choices: choicesList,
    default: 'previousMenu',
    pageSize: 10,
  }];
  
  const answers = await inquirer.prompt(prompt);

  switch (answers.menu) {
    case "previousMenu":
      return false;
    case "updateTable":
      await updateAgencies();
      break;
    default:
      const found = rowChoices.find(item => item.value === answers.menu);
      if (found) {
        await electionsMenu.showMenu(found.value);
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
