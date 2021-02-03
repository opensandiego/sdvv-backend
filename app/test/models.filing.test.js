var expect = require('chai').expect;
var faker = require('faker');

const db = require('../models');
const Filing = db.sequelize.models.Filing;

describe('Filing Database Model', function() {
  beforeEach('Create and empty table: Filing', async function() {
    await Filing.sync({ force: true });
  });

  describe('Filing.create', function() {
    it('should return 1 when one Filing is added', async function() {
      await Filing.create({ id: '123456', filerName: faker.name.findName() });
      const results = await Filing.findAll();
      expect(results.length).to.equal(1);
    });

    it('should return 1 when two Filings with the same id are added using upsert', async function() {
      await Filing.upsert({ id: '123456', filerName: faker.name.findName() });
      await Filing.upsert({ id: '123456', filerName: faker.name.findName() });
      const results = await Filing.findAll();
      expect(results.length).to.equal(1);
    });

    it('filing.vvHasBeenProcessed should be false for new filing', async function() {
      await Filing.create({ id: '123456', filerName: faker.name.findName() })
      const results = await Filing.findOne({
        where: {
          id: '123456'
        }
      });
      expect(results.vvHasBeenProcessed).to.equal(false);
    });

    it('filing.vvHasBeenProcessed should be true when set for new filing', async function() {
      await Filing.create({ 
        id: '123456', filerName: 
        faker.name.findName(),
        vvHasBeenProcessed: true
      })
      const results = await Filing.findOne({
        where: {
          id: '123456'
        }
      });
      expect(results.vvHasBeenProcessed).to.equal(true);
    });

  });

  describe('Filing.createMultiple', function() {
    it('should return 1 when one Filing object added', async function() {
      const newFilings = { id: '123456', filerName: faker.name.findName() };
      await Filing.createMultiple(newFilings);

      const results = await Filing.findAll();
      expect(results.length).to.equal(1);
    });

    it('should return 2 when two Filings in an array are added', async function() {
      const newFilings = [
        { id: '123456', filerName: faker.name.findName() },
        { id: '234567', filerName: faker.name.findName() }
      ];
      await Filing.createMultiple(newFilings);

      const results = await Filing.findAll();
      expect(results.length).to.equal(2);
    });
       
    it('should return 1 when a Filing with the same id is added', async function() {
      const newFilings1 = { id: '123456', filerName: faker.name.findName() };
      const newFilings2 = { id: '123456', filerName: faker.name.findName() };
      await Filing.createMultiple(newFilings1);
      await Filing.createMultiple(newFilings2);

      const results = await Filing.findAll();
      expect(results.length).to.equal(1);
    });

    it('should return filerName that matches the first filerName when Filing with the same id is added', async function() {
      const filerId = '123456'
      const filerName1 = faker.name.findName();
      const filerName2 = faker.name.findName();

      await Filing.createMultiple({ id: filerId, filerName: filerName1 });
      await Filing.createMultiple({ id: filerId, filerName: filerName2 });

      const results = await Filing.findOne({
        where: {
          id: [filerId]
        }
      });

      expect(results.filerName).to.be.equal(filerName1);
    });

    it('filing.vvHasBeenProcessed should be false for two Filings in an array that are added', async function() {
      const newFilings = [
        { id: '123456', filerName: faker.name.findName() },
        { id: '234567', filerName: faker.name.findName() }
      ];
      await Filing.createMultiple(newFilings);

      const results = await Filing.findAll({
        where: {
          id: ['123456', '234567']
        }
      });

      expect(results[0].vvHasBeenProcessed).to.equal(false);
      expect(results[1].vvHasBeenProcessed).to.equal(false);
    });

    it('filing.vvHasBeenProcessed should be true when set for new filing', async function() {
      const newFilings = [{ 
        id: '123456',
        filerName: faker.name.findName(),
        vvHasBeenProcessed: true,
      }];

      await Filing.createMultiple(newFilings);

      const results = await Filing.findOne({
        where: {
          id: '123456'
        }
      });
      expect(results.vvHasBeenProcessed).to.equal(true);
    });
  });


  describe('Filing.isAmended', function() {

    it('should return false when amendedFilingId matches but vvHasBeenProcessed is false', async function() {
      const filingId = '123456789';
      await Filing.create({ id: faker.random.number(), filerName: faker.name.findName(), vvHasBeenProcessed: false, amendedFilingId: filingId });

      expect(await Filing.isAmended(filingId)).to.equal(false);
    });

    it('should return false when amendedFilingId does not match but vvHasBeenProcessed is true', async function() {
      const filingId = '123456789';
      await Filing.create({ id: faker.random.number(), filerName: faker.name.findName(), vvHasBeenProcessed: true, amendedFilingId: null });

      expect(await Filing.isAmended(filingId)).to.equal(false);
    });

    it('should return true when amendedFilingId matches and vvHasBeenProcessed is true', async function() {
      const filingId = '123456789';
      await Filing.create({ id: faker.random.number(), filerName: faker.name.findName(), vvHasBeenProcessed: true, amendedFilingId: filingId });

      expect(await Filing.isAmended(filingId)).to.equal(true);
    });

  });

  describe('Filing.getAmendedFilingIds', function() {
    const testSequenceNumbers = [ 1, 4, 7, 8, 11, 13, 14 ];
    const amendedFilingId = faker.random.number().toString();

    const testFilings = testSequenceNumbers.map(testSequenceNumber => {
      return {
        id: faker.random.number().toString(),
        amendedFilingId: amendedFilingId,
        filerName: faker.name.findName(), 
        vvHasBeenProcessed: true,
        amendmentSequenceNumber: testSequenceNumber,
      }
    });

    beforeEach('Add testFilings', async function() {
      await Filing.createMultiple(testFilings);
    });

    it('should return 1 when amendmentSequenceNumber is 1', async function() {
      const amendmentSequenceNumber = 1;
      const results = await Filing.getAmendedFilingIds(amendedFilingId, amendmentSequenceNumber);
      expect(results.length).to.equal(1);
    });

    it('should return 5 when amendmentSequenceNumber is 10', async function() {
      const amendmentSequenceNumber = 10;
      const results = await Filing.getAmendedFilingIds(amendedFilingId, amendmentSequenceNumber);
      expect(results.length).to.equal(4+1);
    });

    it('should return one more than the given filings.length', async function() {
      const maxSequenceNumber = Math.max(...testSequenceNumbers) + 1;
      const results = await Filing.getAmendedFilingIds(amendedFilingId, maxSequenceNumber);
      expect(results.length).to.equal(testSequenceNumbers.length + 1);
    });

    it('should include each id in array of filing ids for filings with matching amendedFilingId', async function() {
      const maxSequenceNumber = Math.max(...testSequenceNumbers) + 1;
      const results = await Filing.getAmendedFilingIds(amendedFilingId, maxSequenceNumber);

      testFilings.map(filing => {
        expect(results).to.include(filing.id);
      });
      expect(results).to.include(amendedFilingId);
    });

  });

  describe('.isMaxAmendmentInSequence', function() {
    const testSequenceNumbers = [ 1, 4, 7, 8, 11, 13, 14 ];
    const amendedFilingId = faker.random.number().toString();

    const testFilings = testSequenceNumbers.map(testSequenceNumber => {
      return {
        id: faker.random.number().toString(),
        amendedFilingId: amendedFilingId,
        filerName: faker.name.findName(), 
        vvHasBeenProcessed: true,
        amendmentSequenceNumber: testSequenceNumber,
      }
    });

    beforeEach('Add testFilings', async function() {
      await Filing.createMultiple(testFilings);
    });

    it('should return true when amendmentSequenceNumber is the largest', async function() {
      const aFiling = await Filing.build({ id: '123456', 
        amendmentSequenceNumber: 15, amendedFilingId: amendedFilingId });

      const results = await Filing.isMaxAmendmentInSequence(aFiling.amendedFilingId, 15);

      expect(results).to.equal(true);
    });

    it('should return false when amendmentSequenceNumber is not the largest', async function() {
      const filing = await Filing.build(
        { id: '123456', amendedFilingId: amendedFilingId, amendmentSequenceNumber: 10});

      const results = await Filing.isMaxAmendmentInSequence(filing.amendedFilingId, 10);
      
      expect(results).to.equal(false);
    });

    it('should return false when amendedFilingId is null', async function() {
      const aFiling = await Filing.build({ id: '123456', amendedFilingId: null });

      const results = await Filing.isMaxAmendmentInSequence(aFiling.amendedFilingId);

      expect(results).to.equal(false);
    });
  });

  describe('.setToProcessed', function() {
    it('should be equal to false when setToProcessed() is not called', async function() {
      const filing = await Filing.create({ id: '123456' });

      const results = await Filing.findOne({
        where: {
          id: ['123456']
        }
      });

      expect(results.vvHasBeenProcessed).to.equal(false);
    });

    it('should be equal to true when setToProcessed() is called', async function() {
      const filing = await Filing.create({ id: '123456' });
      await Filing.setToProcessed(filing);

      const results = await Filing.findOne({
        where: {
          id: ['123456']
        }
      });

      expect(results.vvHasBeenProcessed).to.equal(true);
    });
  });

});
