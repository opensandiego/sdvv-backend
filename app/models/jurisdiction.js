'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jurisdiction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Jurisdiction.init({
    city: DataTypes.STRING,
    type: DataTypes.STRING,
    name: DataTypes.STRING,
    zipCodes: DataTypes.ARRAY(DataTypes.STRING),
  }, {
    sequelize,
    modelName: 'Jurisdiction',
  });
  return Jurisdiction;
};
