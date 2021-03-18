'use strict';

const murmurhash = require('murmurhash');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Election extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Election.belongsTo(models.Agency, {
        foreignKey: 'agencyShortName',
        onDelete: 'NO ACTION',
      });

      Election.belongsToMany(models.Candidate, {
        through: 'CandidateElection',
      });
    }
  };
  Election.init({
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    agencyShortName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fullElectionTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    electionDate: {
      type: DataTypes.DATE,
    },
    electionYear: {
      type: DataTypes.STRING,
    },
    electionType: {
      type: DataTypes.STRING,
    },
    candidatesLastUpdated: {
      type: DataTypes.DATE,
    },
  }, {
    hooks: {
      beforeValidate: (instance, options) => {
        if (!instance.fullElectionTitle) { return; }
        const titleParts = instance.fullElectionTitle.split(' ');
        const dateParts = titleParts[0].split('/');

        instance.electionYear = dateParts[dateParts.length-1];
        instance.electionDate = new Date(titleParts[0]);
        instance.electionType = titleParts[1];
      }
    },
    sequelize,
    modelName: 'Election',
  });
  return Election;
};
