require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { success, errorResponse } = require("../../utils/constants");
const {
  adminqbanksTest,
  admincreateTest,
  adminfindTest,
  adminunblockTest,
  adminblockTest,
} = require("../../services/admin/admin.test.service");

module.exports = {
  //This service is responsible for creating a modirator in the database
  AdminCreateTest: async (req, res, next) => {
    try {
      const { qbankid, name, description, duration } = req.body;
      let newtest = await admincreateTest(qbankid, name, description, duration);
      if (newtest) {
        return res
          .status(200)
          .json(success("Test created Successfully", res.statusCode));
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

  AdminQBanksTest: async (req, res, next) => {
    try {
      console.log("data");
      let id = req.query.id;
      console.log("id", id);
      let test = await adminqbanksTest(id);
      if (test) {
        return res.status(200).json(success(test, res.statusCode));
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

  AdminUpdateTest: async (req, res, next) => {
    try {
      const { testid, name, description, duration } = req.body;

      let test = await adminupdateQuestion(testid, name, description, duration);
      return res.status(200).json(success(test, res.statusCode));
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },

  AdminFindTest: async (req, res, next) => {
    try {
      let id = req.params.id;
      let test = await adminfindTest(id);
      return res.status(200).json(success(test, res.statusCode));
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },
  AdminLockTest: async (req, res, next) => {
    try {
      let id = req.params.id;
      let qbanks = await adminblockTest(id);
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
  AdminUnlockTest: async (req, res, next) => {
    try {
      let id = req.params.id;
      let qbanks = await adminunblockTest(id);
      if (qbanks) {
        return res
          .status(200)
          .json(success("Test Successfully Open For Users", res.statusCode));
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
