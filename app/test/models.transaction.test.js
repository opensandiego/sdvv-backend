var expect = require('chai').expect;
var faker = require('faker');

const db = require('../models');
const Transaction = db.sequelize.models.Transaction;

describe('Transaction Database Model', function() {
  beforeEach('Create and empty table: Transaction', async function() {
    await Transaction.sync({ force: true });
  });

  describe('Transaction.create', function() {
    it('should return 1 when one Transaction is added', async function() {
      await Transaction.create({ 
        netFileKey: faker.random.uuid(), 
        filingId: '12345678',
        filerName: faker.name.findName(),
      });

      const results = await Transaction.findAll();

      expect(results.length).to.equal(1);
    });

    it('should return 1 when two Transaction with the same netFileKey are added using upsert', async function() {
      const uuid = faker.random.uuid();
      await Transaction.upsert({ 
        netFileKey: uuid, 
        filingId: '1234567',
        filerName: faker.name.findName(),
      });

      await Transaction.upsert({ 
        netFileKey: uuid, 
        filingId: '3456789',
        filerName: faker.name.findName(),
      });

      const results = await Transaction.findAll();
      expect(results.length).to.equal(1);
    });

    it('filing.vvIncludeInCalculations should be false for new transaction', async function() {
      const uuid = faker.random.uuid();

      await Transaction.create({ 
        netFileKey: uuid, 
        filingId: '3456789',
        filerName: faker.name.findName(),
      });

      const results = await Transaction.findOne({
        where: {
          netFileKey: uuid
        }
      });

      expect(results.vvIncludeInCalculations).to.equal(false);
    });

    it('filing.vvIncludeInCalculations should be true when set for new transaction', async function() {
      const uuid = faker.random.uuid();

      await Transaction.create({ 
        netFileKey: uuid, 
        filingId: '3456789',
        filerName: faker.name.findName(),
        vvIncludeInCalculations: true,
      });

      const results = await Transaction.findOne({
        where: {
          netFileKey: uuid
        }
      });

      expect(results.vvIncludeInCalculations).to.equal(true);
    });
  });

  describe('Transaction.createMultiple', function() {
    it('should return 1 when one Transaction object is added', async function() {
      await Transaction.createMultiple({ 
        netFileKey: faker.random.uuid(), 
        filingId: faker.random.number(),
        filerName: faker.name.findName(),
      });

      const results = await Transaction.findAll();

      expect(results.length).to.equal(1); 
    });

    it('should return 2 when two Transactions in an array are added', async function() {
      const newTransactions = [{ 
          netFileKey: faker.random.uuid(), 
          filingId: faker.random.number(),
          filerName: faker.name.findName(),
        }, {
          netFileKey: faker.random.uuid(), 
          filingId: faker.random.number(),
          filerName: faker.name.findName(),
      }];
      await Transaction.createMultiple(newTransactions);

      const results = await Transaction.findAll();
      expect(results.length).to.equal(2);    
    });

    it('should return 1 when a Transactions with the same netFileKey is added', async function() {
      const uuid = faker.random.uuid();

      const newTransaction1 = { 
        netFileKey: uuid, 
        filingId: '123456',
        filerName: faker.name.findName(),
      };
      const newTransaction2 = { 
        netFileKey: uuid, 
        filingId: '234567',
        filerName: faker.name.findName(),
      };

      await Transaction.createMultiple(newTransaction1);
      await Transaction.createMultiple(newTransaction2);

      const results = await Transaction.findAll();
      expect(results.length).to.equal(1);
    });

    it('transaction.vvIncludeInCalculations should be false for two Filings in an array that are added', async function() {

      const uuid1 = faker.random.uuid();
      const uuid2 = faker.random.uuid();

      const newTransactions = [
        {
          netFileKey: uuid1, 
          filingId: '234567', 
          filerName: faker.name.findName()
        },
        {
          netFileKey: uuid2, 
          filingId: '123456', 
          filerName: faker.name.findName()
        },
      ];
      await Transaction.createMultiple(newTransactions);

      const results = await Transaction.findAll({
        where: {
          netFileKey: [uuid1, uuid2]
        }
      });

      expect(results[0].vvIncludeInCalculations).to.equal(false);
      expect(results[1].vvIncludeInCalculations).to.equal(false);
    });

    it('filing.vvIncludeInCalculations should be true when set for new transaction', async function() {
      const uuid = faker.random.uuid();

      const newTransactions = [{ 
        netFileKey: uuid, 
        filingId: '3456789',
        filerName: faker.name.findName(),
        vvIncludeInCalculations: true,
      }];

      await Transaction.createMultiple(newTransactions);

      const results = await Transaction.findOne({
        where: {
          netFileKey: uuid
        }
      });

      expect(results.vvIncludeInCalculations).to.equal(true);
    });
  });
  describe('Transaction.createMultiple with included and excluded transactions', function() {

   const transactionsIncluded = Array.from({length: 3}, () => {
      return {
        netFileKey: faker.random.uuid(), 
        filingId: faker.random.number().toString(), 
        filerName: faker.name.findName(),
        vvIncludeInCalculations: true,
      }
    });

    const transactionsExcluded = Array.from({length: 5}, () => {
      return {
        netFileKey: faker.random.uuid(), 
        filingId: faker.random.number().toString(), 
        filerName: faker.name.findName(),
        vvIncludeInCalculations: false,
      }
    });

    it('should return 3 when there are 3 included and 5 excluded transactions', async function() {
      await Transaction.createMultiple(transactionsIncluded);
      await Transaction.createMultiple(transactionsExcluded);

      const results = await Transaction.findAll({
        where: {
          vvIncludeInCalculations: true
        }
      });
      expect(results.length).to.equal(3);
    });

    it('should return 5 when there are 3 included and 5 excluded transactions', async function() {
      await Transaction.createMultiple(transactionsIncluded);
      await Transaction.createMultiple(transactionsExcluded);

      const results = await Transaction.findAll({
        where: {
          vvIncludeInCalculations: false
        }
      });
      expect(results.length).to.equal(5);
    });

  });

  describe('Transaction.setIncludedExcluded', function() {
    const filingIds = Array.from({length: 25}, () => 
      faker.random.number(999999).toString() );

    const transactions = filingIds.map(filingId => {
      return {
        netFileKey: faker.random.uuid(), 
        filingId: filingId, 
        filerName: faker.name.findName(),
        vvIncludeInCalculations: faker.random.boolean(),       
      }
    });

    const randomTransactions = Array.from({length: 30}, () => {
      return {
        netFileKey: faker.random.uuid(), 
        filingId: faker.random.number(999999).toString(), 
        filerName: faker.name.findName(),
        vvIncludeInCalculations: faker.random.boolean(),
      }
    });

    it('should return 10 included and 15 excluded transactions', async function() {
      await Transaction.createMultiple(transactions);
      await Transaction.createMultiple(randomTransactions);

      const filingIdsToInclude = filingIds.slice(0, 10);
      const filingIdsToExclude = filingIds.slice(10, 25);

      await Transaction.setIncludedExcluded(filingIdsToInclude, filingIdsToExclude);

      const resultsInclude = await Transaction.findAll({
        where: {
          filingId: filingIdsToInclude,
          vvIncludeInCalculations: true
        }
      });
      const resultsExclude = await Transaction.findAll({
        where: {
          filingId: filingIdsToExclude,
          vvIncludeInCalculations: false
        }
      });
      expect(resultsInclude.length).to.equal(10);
      expect(resultsExclude.length).to.equal(15);
    });

  });

});
