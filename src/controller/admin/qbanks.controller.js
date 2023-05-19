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
      let qbank = await findQbanksByid(qbankid);
      let user = await findUserById(id);

      // add Qbanks to user
      let userqbank = await models.UserQbank.create({
        QBankId: qbank.id,
        UserId: user.id,
      });

      if (userqbank) {
        return res
          .status(201)
          .json(
            success(
              `This Qbanks ${qbank.name} to the user ${user.name} `,
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
};
