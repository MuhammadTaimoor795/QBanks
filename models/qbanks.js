"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class QBanks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      QBanks.hasMany(models.UserQbank);
      QBanks.hasMany(models.Test);
    }
  }
  QBanks.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      type: DataTypes.STRING,
      isactive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "QBanks",
    }
  );
  return QBanks;
};
