"use strict";
const { Model } = require("sequelize");
const { TestStatus, StudentMode } = require("../src/utils/constants");
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

      UserTest.hasMany(models.UserResponse, { onDelete: "CASCADE" });
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
        defaultValue: TestStatus.RESET,
      },
      duration: {
        type: DataTypes.DECIMAL,
      },
      completeDuration: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      remainingDuration: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },

      mode: {
        type: DataTypes.STRING,
        validate: {
          isIn: {
            args: [Object.values(StudentMode)],
            msg: "Invalid mode value",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "UserTest",
    }
  );
  return UserTest;
};
