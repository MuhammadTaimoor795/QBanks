"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserResponse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      UserResponse.belongsTo(models.UserTest);
      UserResponse.belongsTo(models.Question);
      UserResponse.hasMany(models.UserResponseOptions, { onDelete: "CASCADE" });
    }
  }
  UserResponse.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "UserResponse",
    }
  );
  return UserResponse;
};
