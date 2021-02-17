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
    }
  };
  Candidate.init({
    agencyID: { type: DataTypes.STRING, unique: 'compositeIndex' },
    fullName: {
      type: DataTypes.STRING,
      unique: 'compositeIndex',
      set(value) {
        this.setDataValue('fullName', value);

        const names = value.split(' ');
        this.setDataValue('vvLastName', names[names.length-1]);
      }
    },
    fullOfficeName: { type: DataTypes.STRING, unique: 'compositeIndex' },
    fullElectionTitle: {
      type: DataTypes.STRING,
      unique: 'compositeIndex',
      set(value) {
        this.setDataValue('fullElectionTitle', value);

        const titleParts = value.split(' ');
        const date = titleParts[0];
        const dateParts = date.split('/');
        this.setDataValue('vvElectionDate', new Date(date));
        this.setDataValue('vvElectionYear', dateParts[dateParts.length-1]);

        this.setDataValue('vvElectionType', titleParts[1]);
      }
    },
    vvLastName: DataTypes.STRING,
    vvElectionDate: DataTypes.DATE,
    vvElectionYear: DataTypes.STRING,
    vvElectionType: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Candidate',
  });
  return Candidate;
};
