'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Candidate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Candidate.belongsTo(models.Agency, {
        onDelete: 'NO ACTION',
        foreignKey: 'agencyShortName'
      });

      Candidate.belongsToMany(models.Election, {
        through: 'CandidateElection',
      });
    }
  };
  Candidate.init({
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    agencyShortName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue('fullName', value);

        const names = value.split(' ');
        this.setDataValue('vvLastName', names[names.length-1]);
      }
    },
    fullOfficeName: {
      type: DataTypes.STRING,
    },
    vvLastName: DataTypes.STRING,
    vvInGeneralElection: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Candidate',
  });
  return Candidate;
};
