'use strict';
const inquirer = require('inquirer');


async function confirmationMenu(message, defaultToYes = false) {

  const prompt = [{
    type: "confirm",
    name: "doUpdate",
    message: message,
    default: defaultToYes,
  }];

  return (await inquirer.prompt(prompt)).doUpdate;
}


module.exports = {
  confirmationMenu,
}
