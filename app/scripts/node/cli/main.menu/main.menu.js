'use strict';
const inquirer = require('inquirer');

const { menuLoop } = require('../shared.helpers');
const { getAgencyCount, syncModels, closeDBConnection } = require('./main.menu.data');
const agenciesMenu = require('../agencies.menu/agencies.menu');


async function mainMenu() {

  const agencyCount = await getAgencyCount();

  const prompt = [{
    type: "list",
    name: "mainMenu",
    message: "Voters Voice Database Dashboard Administration",
    choices: [
      {
        name: "Agencies/Elections/Candidates" 
          + (agencyCount < 1 ? ' (agencies need to be updated)' : ` (${agencyCount} agencies)`),
        value: "agencies",
      },
      {
        name: "Filings",
        value: "filings",
        disabled: true,
      },
      {
        name: "Transactions",
        value: "transactions",
        disabled: true,
      },
      {
        name: "Sync Database models",
        value: "syncModels",
      },
      {
        name: "Exit",
        value: "exit",
      },
    ],
  }];

  const answers = await inquirer.prompt(prompt);

  if (answers.mainMenu === "agencies") {
    await agenciesMenu.showMenu();
  } else if (answers.mainMenu === "syncModels") {

    console.log('Syncing all models...')
    await syncModels();

  } else if (answers.mainMenu === "exit") {
    await closeDBConnection();
    return false;
  }

  return true;
}

async function showMenu(...args) {
  await menuLoop(mainMenu, args);
}

module.exports = {
  showMenu,
}
