'use strict';

async function menuLoop(menuFn, args = []) {
  let continueLoop = false;

  do {
    continueLoop = await menuFn(...args);
  } while (continueLoop)

  return true;
}


function getAgenciesMenuText(status) {
  return `Agencies (count: ${status.count}, `
    + `last update: ${status.lastUpdate})`;
}

function getFilingsMenuText(status) {
  return `Filings (count: ${status.count})`;
}

function getTransactionsMenuText(status) {
  return `Transactions (count: ${status.count})`;
}


function combineAgencies(agenciesWithElections, agenciesInDB) {

  const agencies = agenciesInDB.map(agency => {

    const found = agenciesWithElections
      .find(element => element.agencyShortName === agency.shortcut);  

    return {
      shortName: agency.shortcut,
      name: agency.name,
      inDB: found ? true : false,
      electionTitleCount: found ? found.electionTitleCount : null,
      mostRecentElectionDate: found ? found.mostRecentElectionDate : null,
    };

  });

  return agencies;
}

function sortAgencies(agencies) {

  let sorted = agencies.sort((a, b) => a.name.localeCompare(b.name));
  sorted = sorted.sort((a, b) => (a.inDB === b.inDB)? 0 : a.inDB ? -1 : 1);

  return sorted
}

function getAgenciesMenu(agencies) {

  return agencies.map( agency => {
    const nameSuffix = agency.inDB ? `, (${agency.electionTitleCount} elections, ` +
        `most recent: ${agency.mostRecentElectionDate.toLocaleDateString()})` : '';

    return { 
      name: `${agency.shortName}, '${agency.name}'${nameSuffix}`,
      value: `${agency.shortName}`,
    }
  });

}


function combineElections(electionsFromDB, electionsFromNetFile) {
  
  const fullElectionTitles = electionsFromDB.map(election => election.fullElectionTitle);

  const combinedTitles = Array.from(new Set([].concat(fullElectionTitles, electionsFromNetFile)));

  const combinedElections = combinedTitles.map(electionTitle => {
    const found = electionsFromDB.find( electionFromDB => electionFromDB.fullElectionTitle === electionTitle);

    const election = found ? found : { fullElectionTitle: electionTitle };
    election.inDB = found ? true : false;

    return election;
  });

  return combinedElections;
}

function sortElections(elections) {

  return elections.sort((firstElection, secondElection) => {
    const firstDate = new Date((firstElection.fullElectionTitle.split(' '))[0]);
    const secondDate = new Date((secondElection.fullElectionTitle.split(' '))[0]);

    return (firstDate < secondDate) ? 1 : -1;
  });

}

function getElectionsMenu(elections) {
  return elections.map( election => {

    const name = election.inDB 
      ? `(${election.candidatesCount} candidates, ${election.count} offices, `
        + `last updated from NetFile on ${election.lastUpdated.toLocaleDateString()})`
      : '';
    
    return {
      name: `${election.fullElectionTitle} ${name}`,
      value: `${election.fullElectionTitle}`,
    }
  });
}


module.exports = {
  menuLoop,

  getAgenciesMenuText,
  getFilingsMenuText,
  getTransactionsMenuText,

  combineAgencies,
  sortAgencies,
  getAgenciesMenu,

  combineElections,
  sortElections,
  getElectionsMenu,
}
