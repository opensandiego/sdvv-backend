'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ZipCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ZipCode.init({
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    type: DataTypes.STRING,
    decommissioned: DataTypes.INTEGER,
    primary_city: DataTypes.STRING,
    acceptable_cities: DataTypes.TEXT,
    unacceptable_cities: DataTypes.TEXT,
    state: DataTypes.STRING,
    county: DataTypes.STRING,
    timezone: DataTypes.STRING,
    area_codes: DataTypes.STRING,
    world_region: DataTypes.STRING,
    country: DataTypes.STRING,
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL,
    irs_estimated_population_2015: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ZipCode',
  });
  return ZipCode;
};