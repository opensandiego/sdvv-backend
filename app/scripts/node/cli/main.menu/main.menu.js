'use strict';
const inquirer = require('inquirer');

const { menuLoop } = require('../shared.helpers');
const { getAgencyCount, syncModels, closeDBConnection, testDatabaseConnection } = require('./main.menu.data');
const agenciesMenu = require('../agencies.menu/agencies.menu');


async function mainMenu() {
  
  const isDatabaseConnected = await testDatabaseConnection();
  
  const agencyCount = isDatabaseConnected ? await getAgencyCount() : 0;

  const prompt = [{
    type: "list",
    name: "mainMenu",
    message: "Voters Voice Database Dashboard Administration",
    choices: [
      new inquirer.Separator(isDatabaseConnected ? 'Database connected' : 'Database NOT connected'),
      {
        name: "Agencies/Elections/Candidates" 
          + (agencyCount < 1 ? ' (agencies need to be updated)' : ` (${agencyCount} agencies)`),
        value: "agencies",
        disabled: !isDatabaseConnected,
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
        disabled: !isDatabaseConnected,
      },
      {
        name: "Show process.env.NODE_ENV",
        value: "configure",
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
  } else if (answers.mainMenu === "configure") {

    console.log('** process.env.NODE_ENV', process.env.NODE_ENV)

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
