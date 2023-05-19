const models = require("../../../models/index");
const { Op } = require("sequelize");
const db = require("../../../models/index");
const { ApiError } = require("../../utils/error");
const sequelize = db.sequelize;

async function adminaddQuestion(testid, description) {
  let addquestion = await models.Question.create({
    TestId: testid,
    description,
  });
  if (addquestion) {
    return true;
  }
}

async function admintestQuestions(id) {
  const where = {};
  // if (isactive === "true") {
  //   console.log("yes");
  //   where.isactive = true;
  //   where.TestId = id;
  // }
  // if (isactive == "false") {
  //   console.log("No");
  //   where.isactive = false;
  //   where.TestId = id;
  // }
  where.TestId = id;
  let question = await models.Question.findAll({
    where,
    include: [
      {
        model: models.Option,
      },
    ],
  });
  if (!question) {
    return [];
  } else {
    return question;
  }
}

async function adminfindQuestion(id) {
  let test = await models.Question.findOne({
    where: {
      id,
    },
    include: [
      {
        model: models.Option,
      },
    ],
  });

  if (!test) {
    throw new ApiError("test Not Found with this is ", {
      status: 400,
    });
  } else {
    return test;
  }
}

async function adminupdateQuestion(description, id) {
  await adminfindQuestion(id);
  let question = await models.Question.update(
    { description },
    { where: { id: id } }
  );
  if (question) {
    return true;
  }
}

async function adminblockQuestion(id) {
  await adminfindQuestion(id);
  let test = await models.Question.update(
    { isactive: false },
    { where: { id: id } }
  );
  if (test) {
    return true;
  }
}

async function adminunblockQuestion(id) {
  await adminfindQuestion(id);
  let test = await models.Question.update(
    { isactive: true },
    { where: { id: id } }
  );
  if (test) {
    return true;
  }
}

module.exports = {
  adminaddQuestion,
  admintestQuestions,
  adminfindQuestion,
  adminupdateQuestion,
  adminblockQuestion,
  adminunblockQuestion,
};
