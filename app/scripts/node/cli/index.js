'use strict';
const inquirer = require('inquirer');
const agenciesMenu = require('./agenciesMenu');
const candidatesMenu = require('./candidatesMenu');
const status = require('./status');
const menuUtil = require('./menuUtil');


async function mainMenu() {

  const agenciesStatus = await status.agenciesStatus();
  const agenciesMenuText = menuUtil.getAgenciesMenuText(agenciesStatus);

  const prompt = [{
    type: "list",
    name: "mainMenu",
    message: "Voters Voice Database Dashboard Administration",
    choices: [
      {
        name: agenciesMenuText,
        value: "agencies",
      },
      {
        name: "Elections/Candidates",
        value: "candidates",
        disabled: agenciesStatus.count < 1 ? 'agencies need to be updated' : false,
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
    await agenciesMenu.menu();
  } else if (answers.mainMenu === "candidates") {
    await candidatesMenu.menu();
  } else if (answers.mainMenu === "syncModels") {

    console.log('Syncing all models...')
    const db = require('../../../models/index')
    const sequelize = db.sequelize
    sequelize.sync({ alter: true })

  } else if (answers.mainMenu === "exit") {
    return false;
  }

  return true;
}


;(async () => {
  await menuUtil.menuLoop(mainMenu);
})();
