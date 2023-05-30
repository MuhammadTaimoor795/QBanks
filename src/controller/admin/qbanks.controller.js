require("dotenv").config();
const models = require("../../../models/index");

// const { Op } = require("sequelize");

const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { success, errorResponse } = require("../../utils/constants");
const {
  createQbanks,
  allQbanks,
  deactiviteQbanks,
  activiteQbanks,
  findQbanksByidAdmin,
} = require("../../services/admin/qbanks.service");
const { findQbanksByid } = require("../../services/user/user.qbanks.service");
const { findUserById } = require("../../services/user/user.service");

module.exports = {
  //This service is responsible for creating a modirator in the database
  CreateQanks: async (req, res, next) => {
    try {
      const { name, description, type } = req.body;
      let newqbank = await createQbanks(name, description, type);
      if (newqbank) {
        return res
          .status(200)
          .json(success("Qanks created Successfully", res.statusCode));
      }
      // else {
      //   return res
      //     .status(400)
      //     .json(errorResponse("User Already Exist", res.statusCode));
      // }
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },
  AllQBanks: async (req, res, next) => {
    try {
      let qbanks = await allQbanks();
      if (qbanks) {
        return res.status(200).json(success(qbanks, res.statusCode));
      }
      // else {
      //   return res
      //     .status(400)
      //     .json(errorResponse("User Already Exist", res.statusCode));
      // }
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },
  FindByIdQBanks: async (req, res, next) => {
    try {
      let id = req.params.id;
      let qbanks = await findQbanksByidAdmin(id);
      return res.status(200).json(success(qbanks, res.statusCode));
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },
  LockQBanks: async (req, res, next) => {
    try {
      let id = req.params.id;
      let qbanks = deactiviteQbanks(id);
      if (qbanks) {
        return res
          .status(200)
          .json(success("Qbanks Successfully blocked", res.statusCode));
      }
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },
  UnlockQBanks: async (req, res, next) => {
    try {
      let id = req.params.id;
      let qbanks = activiteQbanks(id);
      if (qbanks) {
        return res
          .status(200)
          .json(success("Qbanks Successfully Un blocked", res.statusCode));
      }
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },

  AddQBanksToUser: async (req, res, next) => {
    try {
      let id = req.body.userid;
      let qbankid = req.body.qbankid;

      console.table({ id, qbankid });
      let qbank = await findQbanksByid(qbankid);
      let user = await findUserById(id);

      // add Qbanks to user

      console.log("q", qbank.id);
      console.log("u", user.id);
      let finduserqbank = await models.UserQbank.findOne({
        where: {
          QBankId: qbank.id,
          UserId: user.id,
          active: true,
        },
      });

      console.log("finduserqbank", finduserqbank);

      if (finduserqbank) {
        return res
          .status(400)
          .json(
            errorResponse(
              `This ${qbank.name} is already assign  the user ${user.username} `,
              res.status
            )
          );
      }

      let isnotacive = await models.UserQbank.findOne({
        where: {
          QBankId: qbank.id,
          UserId: user.id,
          active: false,
        },
      });

      if (!isnotacive) {
        let userqbank = await models.UserQbank.create({
          QBankId: qbank.id,
          UserId: user.id,
        });

        if (userqbank) {
          return res
            .status(201)
            .json(
              success(
                `This ${qbank.name} to the user ${user.username} `,
                res.statusCode
              )
            );
        }
      }
      //
      let reactivate = await models.UserQbank.update(
        { active: true },
        {
          where: {
            QBankId: qbank.id,
            UserId: user.id,
          },
        }
      );
      if (reactivate) {
        return res
          .status(201)
          .json(
            success(
              `This ${qbank.name} to the user ${user.username} `,
              res.statusCode
            )
          );
      }
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },

  RemoveQBanksToUser: async (req, res, next) => {
    try {
      let id = req.body.userid;
      let qbankid = req.body.qbankid;

      console.table({ qbankid, id });
      let qbank = await findQbanksByid(qbankid);
      let user = await findUserById(id);

      // add Qbanks to user

      let finduserqbank = await models.UserQbank.findOne({
        QBankId: qbank.id,
        UserId: user.id,
      });

      if (!finduserqbank) {
        return res
          .status(400)
          .json(
            errorResponse(
              `This ${qbank.name} is not Present  in the user ${user.username} `,
              res.status
            )
          );
      }
      let userqbank = await models.UserQbank.update(
        { active: false },
        { where: { QBankId: qbank.id, UserId: user.id } }
      );

      if (userqbank) {
        return res
          .status(201)
          .json(
            success(
              `This ${qbank.name} is removed from the  ${user.username} `,
              res.statusCode
            )
          );
      }
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },
  QBanksUserAdmin: async (req, res, next) => {
    try {
      let id = req.query.id;
      let user = await findUserById(id);

      // add Qbanks to user

      let qbanks = await models.UserQbank.findAll({
        where: {
          UserId: user.id,
        },
      });

      if (qbanks) {
        return res.status(201).json(success(qbanks, res.statusCode));
      }
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },
};
