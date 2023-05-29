"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      User.belongsTo(models.Role);
      User.hasMany(models.UserQbank);

      User.hasMany(models.UserTest);
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: DataTypes.STRING,
      refreshToken: { type: DataTypes.STRING, defaultValue: "" },
      verificationToken: { type: DataTypes.STRING, defaultValue: "" },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      username: DataTypes.STRING,
      profileImage: {
        type: DataTypes.STRING,
        defaultValue:
          `${process.env.IMAGE_PATH_ORIGIN}` + "public/assets/profileImage.png",
      },
      description: { type: DataTypes.STRING, defaultValue: "" },
      country: { type: DataTypes.STRING, defaultValue: "world wide" },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
