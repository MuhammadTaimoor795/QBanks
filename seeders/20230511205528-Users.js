"use strict";
const models = require("../models");
const { sequelize } = require("../models");
const bcrypt = require("bcrypt");
const { getQuestion, getPersonName } = require("random-questions");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    try {
      await sequelize.sync({ force: true, alter: true });
      let roles = await models.Role.bulkCreate([
        {
          name: "user",
        },
        {
          name: "Admin",
        },
      ]);

      console.log("roles", roles[0].dataValues.id);

      let user = await models.User.bulkCreate([
        {
          email: "user1@gmail.com",
          password: await bcrypt.hash("Abcd123@+", 10),
          isVerified: true,
          isActive: true,
          RoleId: roles[0].dataValues.id,
        },

        {
          email: "admin@gmail.com",
          password: await bcrypt.hash("Abcd123@+", 10),
          isVerified: true,
          isActive: true,
          RoleId: roles[1].dataValues.id,
        },
      ]);

      let qbanks = await models.QBanks.bulkCreate([
        {
          name: "Qbank1",
        },
        {
          name: "Qbank2",
        },
        {
          name: "Qbank3",
        },
        {
          name: "Qbank4",
        },
      ]);

      let tests = await models.Test.bulkCreate([
        {
          name: "Test1",
          description: "This is Test ",
          duration: "10 mins",
          category: "categoryA",
          QBankId: qbanks[0].dataValues.id,
        },
        {
          name: "Test2",
          description: "This is Test ",
          duration: "10 mins",
          category: "categoryA",
          QBankId: qbanks[0].dataValues.id,
        },
        {
          name: "Test3",
          description: "This is Test ",
          duration: "10 mins",
          category: "categoryA",
          QBankId: qbanks[1].dataValues.id,
        },
        {
          name: "Test4",
          description: "This is Test ",
          duration: "10 mins",
          category: "categoryA",
          QBankId: qbanks[2].dataValues.id,
        },
      ]);

      for (let i = 0; i <= 10; i++) {
        let name = getQuestion();
        console.log("Quesiton", name);
        let Question = await models.Question.create({
          name,
          TestId: tests[0].dataValues.id,
        });
      }
    } catch (error) {
      console.log("Error", error);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
