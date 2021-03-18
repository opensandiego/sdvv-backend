const Sequelize = require('sequelize');
const db = require('../../../models/index');
const AgencyModel = db.sequelize.models.Agency;
const ElectionModel = db.sequelize.models.Election;
const CandidateModel = db.sequelize.models.Candidate;

const murmurhash = require('murmurhash');

async function testDatabaseConnection() {

  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }

}

async function doesTableExist(Model) {
  let exists = true;

  try {
    await Model.findAll();
  } catch(error) {
    if (error instanceof Sequelize.DatabaseError) {
      exists = false;
    } else {
      throw error;
    }
  }

  return exists;
}

async function syncModels() { 
  db.sequelize.sync({ alter: true })
}

async function closeDBConnection() {
  await db.sequelize.close();
}

/**
 * @param {object|object[]} instances 
 * @param {object} Model 
 */
 async function updateInstancesInModel(instances, Model) {
  instances = Array.isArray(instances) ? instances : [ instances ];

  const tableExits = await doesTableExist(Model);
  
  if (!tableExits) {
    await Model.sync();
  }
  
  for await(instance of instances) {
    await Model.upsert(instance);
  }
}


module.exports = {
  db,
  AgencyModel,
  ElectionModel,
  CandidateModel,
  murmurhash,
  testDatabaseConnection,
  doesTableExist,
  syncModels,
  closeDBConnection,
  updateInstancesInModel,
}
