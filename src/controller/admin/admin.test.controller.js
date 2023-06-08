require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const csv = require("csvtojson");
const { success, errorResponse } = require("../../utils/constants");
const {
  adminqbanksTest,
  admincreateTest,
  adminfindTest,
  adminunblockTest,
  adminblockTest,
} = require("../../services/admin/admin.test.service");
const {
  adminupdateQuestion,
  adminaddQuestion,
  adminaddTestFile,
} = require("../../services/admin/admin.question.service");

module.exports = {
  //This service is responsible for creating a modirator in the database
  AdminCreateTest: async (req, res, next) => {
    try {
      const { qbankid, name, description } = req.body;
      let newtest = await admincreateTest(qbankid, name, description);
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
      const { testid, name, description } = req.body;

      let test = await adminupdateQuestion(testid, name, description);

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

  AdminAddTestyFile2: async (req, res, next) => {
    try {
      let csvData = req.file.buffer.toString();

      console.log("csvData : ", csvData);
      let questions = [];
      csv()
        .fromString(csvData)
        .then((jsonArray) => {
          jsonArray.forEach((row) => {
            const questionText = row.questionText;
            const options = [];
            const correctOptions = [];

            for (let i = 1; i <= 4; i++) {
              const option = row[`option${i}`];
              options.push(option);

              const isCorrect = row[`option${i}_isCorrect`] === "TRUE";
              if (isCorrect) {
                correctOptions.push(option);
              }
            }

            const question = {
              question: questionText,
              options: options,
              correctOptions: correctOptions,
            };

            questions.push(question);
          });

          // Convert the questions array to JSON
          let jsonData = JSON.stringify(questions);

          // Do something with the JSON data (e.g., write to a file, send over the network)
          return res.json(jsonData);
        })
        .catch((error) => {
          console.error("Error converting CSV to JSON:", error);
        });

      //const { testid, description, options } = req.body;
      // let question = await adminaddQuestion(testid, description);

      // for (let item of options) {
      //   let addoption = await adminaddquestionOption(
      //     question,
      //     item.name,
      //     item.istrue
      //   );
      // }
      // if (question) {
      //   return res
      //     .status(201)
      //     .json(success("Question Added to Test Successfully", res.statusCode));
      // }
      // // else {
      // //   return res
      // //     .status(400)
      // //     .json(errorResponse("User Already Exist", res.statusCode));
      // // }
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },
  AdminAddTestyFile: async (req, res, next) => {
    try {
      const { qbankid, name, description, question } = req.body;
      let test = await adminaddTestFile(qbankid, name, description, question);
      if (test) {
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
};
