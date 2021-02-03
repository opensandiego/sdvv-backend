'use strict';
const { Op } = require("sequelize");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Filing extends Model {

    static async createMultiple(filings) {

      filings = Array.isArray(filings) ? filings : [ filings ];

      const modelFields = [ 
        'id', 'agency', 'isEfiled', 'hasImage', 'filingDate', 'title', 'form', 'filerName', 
        'filerLocalId', 'filerStateId', 'amendmentSequenceNumber', 'amendedFilingId', 'vvHasBeenProcessed' 
      ];
  
      await Filing.bulkCreate(filings, { fields: modelFields, validate: true, ignoreDuplicates: true });

      return filings.map(filing => filing.id);

    }

    static async getUnprocessedFilings() {

      return await Filing.findAll({
        attributes: [ 'id', 'amendmentSequenceNumber', 'amendedFilingId', 'vvHasBeenProcessed' ],
        where: { 
          vvHasBeenProcessed: false
        }
      });

    }

    static async isAmended(filingId) {

      // if there is at least one match then the filing has been amended
      const count = await Filing.count({
        where: {
          amendedFilingId: filingId,
          vvHasBeenProcessed: true
        }
      });

      return count > 0;

    }

    static async getMaxAmendmentSequenceNumber(amendedFilingId) {

      return await Filing.max( 'amendmentSequenceNumber', {
        where: {
          amendedFilingId: amendedFilingId,
          vvHasBeenProcessed: true
        }
      });

    }

    static async getAmendedFilingIds(amendedFilingId, amendmentSequenceNumber) {

      const result = await Filing.findAll({
        attributes: [ 'id' ],
        where: {
          amendedFilingId: amendedFilingId,
          amendmentSequenceNumber: { [Op.lt]: amendmentSequenceNumber },
          vvHasBeenProcessed: true
        }
      });

      const filingIds = result.map(result => result.id);
      filingIds.push(amendedFilingId);

      return filingIds;

    }

    static async isMaxAmendmentInSequence(amendedFilingId, amendmentSequenceNumber) {

      if (amendedFilingId === null) { return false; }

      const maxAmendedNumber = await Filing.max( 'amendmentSequenceNumber', {
        where: {
          amendedFilingId: amendedFilingId,
          vvHasBeenProcessed: true
        }
      });
      
      return amendmentSequenceNumber > maxAmendedNumber;
    }

    static async setToProcessed(filing) {
      filing.vvHasBeenProcessed = true;
      await filing.save();
    }
    
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Filing.init({
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    agency: DataTypes.INTEGER,
    isEfiled: DataTypes.BOOLEAN,
    hasImage: DataTypes.BOOLEAN,
    filingDate: DataTypes.STRING,
    title: DataTypes.STRING,
    form: DataTypes.INTEGER,
    filerName: DataTypes.STRING,
    filerLocalId: DataTypes.STRING,
    filerStateId: DataTypes.STRING,
    amendmentSequenceNumber: DataTypes.INTEGER,
    amendedFilingId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vvHasBeenProcessed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Filing',
    indexes: [{ fields: ['filerName', 'amendedFilingId'] }]
  });
  return Filing;
};
