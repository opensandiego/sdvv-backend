'use strict';

async function menuLoop(menuFn, args = []) {
  let continueLoop = false;

  do {
    continueLoop = await menuFn(...args);
  } while (continueLoop)

  return true;
}

function getColumnWidth(table, columnTitle, minWidth = 0) {
  
  return table.reduce( (accumulator, currentValue) => 
    Math.max(currentValue[columnTitle].toString().length, accumulator), 
    minWidth
  );

}

function padColumn(table, columnTitle, columnWidth = 0, padString = " ") {

  return table.map(row => {
    let padded = row.padded || {};
    padded[columnTitle] = row[columnTitle].toString().padEnd(columnWidth, padString)
    row.padded = padded;
    return row;
  });

}


/**
 * @typedef {object} Columns
 * @property {object} heading
 * @property {object[]} rows
 */

/**
 * @param {object[]} sourceRows 
 * @param {object} headerRow 
 * @param {string[]} columnNames 
 * @returns {Columns} 
 */
function getPaddedColumns(sourceRows, headerRow, columnNames) {

  let rows = [...sourceRows];

  rows.push(headerRow);

  columnNames.forEach(columnName => {
    const columnWidth = getColumnWidth(rows, columnName);
    rows = padColumn(rows, columnName, columnWidth);
  });

  let heading = rows.pop();

  return { heading, rows };
}

module.exports = {
  menuLoop,
  getPaddedColumns,
}
