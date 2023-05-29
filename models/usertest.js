"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserTest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserTest.belongsTo(models.User);
      UserTest.belongsTo(models.Test);

      UserTest.hasMany(models.UserResponse);
    }
  }
  UserTest.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "InComplete",
      },
    },
    {
      sequelize,
      modelName: "UserTest",
    }
  );
  return UserTest;
};
