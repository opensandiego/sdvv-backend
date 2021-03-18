'use strict';
const puppeteer = require('puppeteer');

const getLiHandles = async (handle, selector = ':scope ') =>
  await Promise.all( await handle.$$(`${selector} > li`) );

const getBranchText = async (handle) =>
  await (await (await handle.$(`:scope > div > .rtIn`))
    .getProperty('innerText')).jsonValue();

async function getNetFilePage(aid, browser) {
  const page = await browser.newPage();

  await page.goto(`https://public.netfile.com/pub2/?aid=${aid}`, {
    waitUntil: "networkidle2"
  });

  return page;
}

async function expandNode(page, handle) {

  let returnList = [];
  
  const listLIHandles = await getLiHandles(handle);

  for (const liHandle of listLIHandles) {
    
    const branchText = await getBranchText(liHandle);

    const plusHandle = await liHandle.$(`:scope > div > span.rtPlus`);

    if (!plusHandle) {
      returnList.push({ name: branchText });
      continue;
    }

    await plusHandle.evaluate(element => element.click());

    // Skip if the child Ul element has not been added.
    try {
      await page.waitForFunction(
        element => element.querySelector(':scope > ul.rtUL') !== null, 
        { polling: 1000, timeout: 10000 },
        liHandle
      );
    } catch (e) {
      // console.error(e.message);
      // console.error(`Skipping: ${branchText}`);
      continue;
    }

    const UlHandle =  await liHandle.$(`:scope > ul.rtUL`)
    
    returnList.push({
      name: branchText,
      elements: await expandNode(page, UlHandle)
    })

  }

  return returnList;
}


async function getElectionCycleLiHandle(parentHandle, electionCycleTitle) {
  // listLIHandles will be all of the child li node elements of parentHandle
  let listLIHandles = await getLiHandles(parentHandle);
 
  // Find the liHandle within listLIHandles that has text that matches electionCycleTitle
  for (const liHandle of  listLIHandles) {
    let branchText = await getBranchText(liHandle);

    if (branchText === electionCycleTitle) {
      return liHandle;
    }
  }

  throw new Error(`Cycle title '${electionCycleTitle}' not found.`);
}

async function getElectionCycleUlHandle(page, branchHandle, electionCycleTitle) {
 
  let cycleLIHandle = await getElectionCycleLiHandle(branchHandle, electionCycleTitle);

  let plusHandle = await cycleLIHandle.$(`:scope > div > span.rtPlus`);

  if (!plusHandle) throw new Error(`Not able to expand Cycle '${electionCycleTitle}.'`);
  
  // Clicking on the plusHandle element causes the page to make a network request and add a child ul element.
  await plusHandle.evaluate(element => element.click());

  // Do not continue if the child Ul element has not been added.
  try {
    await page.waitForFunction(
      element => element.querySelector(':scope > ul.rtUL') !== null,
      { polling: 1000, timeout: 10000 },
      cycleLIHandle
    );    
  } catch (e) {
    throw new Error(`Not able to use: ${electionCycleTitle}`);
  }

  return await cycleLIHandle.$(`:scope > ul.rtUL`);
}


/**
 * @param {string} aid - Example: "CSD"
 * @returns {string[]} - Examples: ["11/03/2020 General Election", "03/03/2020 Primary Election"]
 */
async function electionCycleTitles(aid) {
  let titles = [];
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  try {
    const electionCycleRootULSelector = '#ctl00_phBody_browseElections_treeBrowse > ul';
    
    const page = await getNetFilePage(aid, browser);
    let rootHandle = await page.waitForSelector(electionCycleRootULSelector);
    let listLIHandles = await getLiHandles(rootHandle);

    for (const liHandle of  listLIHandles) {
      titles.push(await getBranchText(liHandle));
    }

  } catch {
    console.error(error);
  } finally {
    await browser.close();
    return titles;
  }

}

/**
 * @param {string} aid - Example: "CSD"
 * @param {string[]} titles - Examples: ["11/03/2020 General Election", "03/03/2020 Primary Election"]
 */
async function getMultipleElectionCycleCandidates(aid, titles) {
  titles = Array.isArray(titles) ? titles : [ titles ];

  let forest = [];

  for await (const title of titles) {
    const tree = await getElectionCycleCandidates(aid, title);
    forest.push(tree);
  }

  return forest;
}


/**
 * @param {string} aid - Example: "CSD"
 * @param {string} electionCycleTitle - Example: "11/03/2020 General Election"
 */
async function getElectionCycleCandidates(aid, electionCycleTitle = '') {
  let tree = {};
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  try {
    const page = await getNetFilePage(aid, browser)
    
    const electionCycleRootULSelector = '#ctl00_phBody_browseElections_treeBrowse > ul';
    let rootHandle = await page.waitForSelector(electionCycleRootULSelector);
    
    if (electionCycleTitle !== '') {
      rootHandle = await getElectionCycleUlHandle(page, rootHandle, electionCycleTitle);
    }
    
    tree.cycle = electionCycleTitle
    tree.electionItems = await expandNode(page, rootHandle);
  } catch (error) {
    console.error(error.message);
  } finally {
    await browser.close();
    return tree;
  }
}

module.exports = {
  electionCycleTitles,
  getMultipleElectionCycleCandidates,
};
