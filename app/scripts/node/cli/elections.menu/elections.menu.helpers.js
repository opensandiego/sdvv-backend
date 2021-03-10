'use strict';

const { menuLoop } = require('../shared.helpers');


function getElectionsMenu(elections) {
  return elections.map( election => {

    const name = election.inDB 
      ? `(candidates: ${election.candidatesCount}, offices: ${election.officesCount})`
      : '';
    
    return {
      name: `${election.fullElectionTitle} ${name}`,
      value: `${election.fullElectionTitle}`,
    }
  });
}


module.exports = {
  menuLoop,
  getElectionsMenu,
}
