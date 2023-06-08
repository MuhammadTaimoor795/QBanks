"use strict";
const models = require("../models");
const { sequelize } = require("../models");
const bcrypt = require("bcrypt");
const { getQuestion, getPersonName } = require("random-questions");

const randomQuestions = require("random-questions");
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
          username: "User1",
          RoleId: roles[0].dataValues.id,
        },

        {
          email: "admin@gmail.com",
          password: await bcrypt.hash("Abcd123@+", 10),
          isVerified: true,
          isActive: true,
          username: "Admin",
          RoleId: roles[1].dataValues.id,
        },
      ]);

      let qbanks = await models.QBanks.bulkCreate([
        {
          name: "Qbank1",
          description: "This is Qbanks1 Details",
          type: "Maths",
        },
        {
          name: "Qbank2",
          description: "This is Qbanks2 Details",
          type: "Science",
        },
      ]);

      let tests = await models.Test.bulkCreate([
        {
          name: "Test1",
          description: "This is Test ",

          category: "categoryA",
          QBankId: qbanks[0].dataValues.id,
        },
        {
          name: "Test2",
          description: "This is Test ",

          category: "categoryA",
          QBankId: qbanks[0].dataValues.id,
        },
        {
          name: "Test3",
          description: "This is Test ",

          category: "categoryA",
          QBankId: qbanks[1].dataValues.id,
        },
        {
          name: "Test4",
          description: "This is Test ",

          category: "categoryA",
          QBankId: qbanks[1].dataValues.id,
        },
      ]);

      for (let i = 0; i <= 10; i++) {
        let q1 = getQuestion();
        let Question = await models.Question.create({
          description: q1,
          TestId: tests[0].dataValues.id,
        });

        let ran1 = Math.floor(Math.random() * 4) + 1;
        for (let i = 1; i <= ran1; i++) {
          await models.Option.create({
            name: getPersonName(),
            QuestionId: Question.dataValues.id,
          });
        }

        let q2 = getQuestion();
        let Question2 = await models.Question.create({
          description: q2,
          TestId: tests[1].dataValues.id,
        });

        let ran2 = Math.floor(Math.random() * 4) + 1;
        for (let i = 1; i <= ran2; i++) {
          await models.Option.create({
            name: getPersonName(),
            QuestionId: Question2.dataValues.id,
          });
        }

        let q3 = getQuestion();
        let Question3 = await models.Question.create({
          description: q3,
          TestId: tests[2].dataValues.id,
        });
        let ran3 = Math.floor(Math.random() * 4) + 1;
        for (let i = 1; i <= ran3; i++) {
          await models.Option.create({
            name: getPersonName(),
            QuestionId: Question3.dataValues.id,
          });
        }
        let q4 = getQuestion();
        let Question4 = await models.Question.create({
          description: q4,
          TestId: tests[3].dataValues.id,
        });

        let ran4 = Math.floor(Math.random() * 4) + 1;
        for (let i = 1; i <= ran4; i++) {
          await models.Option.create({
            name: getPersonName(),
            QuestionId: Question4.dataValues.id,
          });
        }
      }

      let userqbanks = await models.UserQbank.create({
        QBankId: qbanks[0].dataValues.id,
        UserId: user[0].dataValues.id,
      });
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
