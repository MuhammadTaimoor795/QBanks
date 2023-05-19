"use strict";
const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("Sequelize", Sequelize.UUID);
    console.log("Sequelize.UUIDV4", Sequelize.UUIDV4);
    await queryInterface.createTable("Roles", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
      },
      // permission: {
      //   type: Sequelize.ARRAY(Sequelize.STRING),
      //   defaultValue: [],
      // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Roles");
  },
};
