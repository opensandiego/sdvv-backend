'use strict';
const inquirer = require('inquirer');


async function mainMenu() {
  
  const prompt = [{
    type: "list",
    name: "agenciesMenu",
    message: "Agencies",
    choices: [
      {
        name: "Update from NetFile",
        value: "updateTable",
      },
      {
        name: "Return to previous menu",
        value: "previousMenu",
      },
    ],
  }];

  const answers = await inquirer.prompt(prompt);

  if (answers.agenciesMenu === "updateTable") {
    await updateAgencies();
  } else if (answers.agenciesMenu === "previousMenu") {
    return false;
  }

  return true;
}

async function updateAgencies(){

  const answers = await inquirer.prompt([{
    type: "confirm",
    name: "doUpdate",
    message: "Confirm update of agencies in database from NetFile API",
  }]);

  if (answers.doUpdate) {
    
    try {
      const update = require("./update");
      await update.updateAgencies();
    } catch(e) {
      console.log('Error updating agencies from NetFile API.');
      console.log(e);
      return;
    }

  }
}


module.exports = {
  menu: mainMenu,
}
