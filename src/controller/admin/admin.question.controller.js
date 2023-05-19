require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { success, errorResponse } = require("../../utils/constants");
const {
  adminaddQuestion,
  admintestQuestions,
  adminfindQuestion,
  adminblockQuestion,
  adminunblockQuestion,
  adminupdateQuestion,
} = require("../../services/admin/admin.question.service");

module.exports = {
  //This service is responsible for creating a modirator in the database
  AdminAddQuestion: async (req, res, next) => {
    try {
      const { testid, description } = req.body;
      let question = await adminaddQuestion(testid, description);
      if (question) {
        return res
          .status(201)
          .json(success("Question Added to Test Successfully", res.statusCode));
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

  AdminTestQuestion: async (req, res, next) => {
    try {
      let id = req.query.id;
      let question = await admintestQuestions(id);
      if (question) {
        return res.status(200).json(success(question, res.statusCode));
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

  AdminFindQuestion: async (req, res, next) => {
    try {
      let id = req.params.id;
      let question = await adminfindQuestion(id);
      return res.status(200).json(success(question, res.statusCode));
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },

  AdminUpdateQuestion: async (req, res, next) => {
    try {
      let id = req.body.questionid;
      let description = req.body.description;

      let question = await adminupdateQuestion(description, id);
      return res.status(200).json(success(question, res.statusCode));
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },

  AdminLockQuestion: async (req, res, next) => {
    try {
      let id = req.params.id;
      let question = await adminblockQuestion(id);
      if (question) {
        return res
          .status(200)
          .json(success("Question Successfully blocked", res.statusCode));
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
  AdminUnLockQuestion: async (req, res, next) => {
    try {
      let id = req.params.id;
      let question = await adminunblockQuestion(id);
      if (question) {
        return res
          .status(200)
          .json(
            success("Question Successfully Open For Users", res.statusCode)
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
