require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { success, errorResponse } = require("../../utils/constants");
const {
  adminaddquestionOption,
  adminquestionOption,
  adminfindquestionOption,
  adminupdatequestionOption,
  adminblockquestionOption,
  adminunblockquestionOption,
} = require("../../services/admin/admin.option.service");

module.exports = {
  //This service is responsible for creating a modirator in the database
  AdminAddOption: async (req, res, next) => {
    try {
      const { questionid, name, istrue } = req.body;
      let Option = await adminaddquestionOption(questionid, name, istrue);
      if (Option) {
        return res
          .status(201)
          .json(success("Option Added to Test Successfully", res.statusCode));
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

  AdminTestOption: async (req, res, next) => {
    try {
      let id = req.query.id;
      let option = await adminquestionOption(id);
      if (option) {
        return res.status(200).json(success(option, res.statusCode));
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

  AdminFindOption: async (req, res, next) => {
    try {
      let id = req.params.id;
      let Option = await adminfindquestionOption(id);
      return res.status(200).json(success(Option, res.statusCode));
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },

  AdminUpdateOption: async (req, res, next) => {
    try {
      let id = req.body.optionid;
      let name = req.body.description;
      let istrue = req.body.istrue;

      let Option = await adminupdatequestionOption(id, name, istrue);
      return res.status(200).json(success(Option, res.statusCode));
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },

  AdminLockOption: async (req, res, next) => {
    try {
      let id = req.params.id;
      let Option = await adminblockquestionOption(id);
      if (Option) {
        return res
          .status(200)
          .json(success("Option Successfully blocked", res.statusCode));
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
  AdminUnLockOption: async (req, res, next) => {
    try {
      let id = req.params.id;
      let Option = await adminunblockquestionOption(id);
      if (Option) {
        return res
          .status(200)
          .json(success("Option Successfully Open For Users", res.statusCode));
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
