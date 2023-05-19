const models = require("../../../models/index");
const { Op } = require("sequelize");
const db = require("../../../models/index");
const { ApiError } = require("../../utils/error");
const sequelize = db.sequelize;

async function adminaddquestionOption(questionid, name, istrue) {
  let addoption = await models.Option.create({
    QuestionId: questionid,
    name,
    istrue,
  });
  if (addoption) {
    return true;
  }
}

async function adminquestionOption(id) {
  const where = {};
  // if (isactive === "true") {
  //   console.log("yes");
  //   where.isactive = true;
  //   where.QuestionId = id;
  // }
  // if (isactive == "false") {
  //   console.log("No");
  //   where.isactive = false;
  //   where.QuestionId = id;
  // }
  where.QuestionId = id;
  let option = await models.Option.findAll({
    where,
  });
  if (!option) {
    return [];
  } else {
    return option;
  }
}

async function adminfindquestionOption(id) {
  let option = await models.Option.findOne({
    where: {
      id,
    },
  });

  if (!option) {
    throw new ApiError("option Not Found with this is ", {
      status: 400,
    });
  } else {
    return option;
  }
}

async function adminupdatequestionOption(id, name, istrue) {
  await adminfindquestionOption(id);
  let option = await models.Option.update(
    { name, istrue },
    { where: { id: id } }
  );
  if (option) {
    return true;
  }
}

async function adminblockquestionOption(id) {
  await adminfindquestionOption(id);
  let option = await models.Option.update(
    { isactive: false },
    { where: { id: id } }
  );
  if (option) {
    return true;
  }
}

async function adminunblockquestionOption(id) {
  await adminfindquestionOption(id);
  let option = await models.Option.update(
    { isactive: true },
    { where: { id: id } }
  );
  if (option) {
    return true;
  }
}

module.exports = {
  adminaddquestionOption,
  adminquestionOption,
  adminfindquestionOption,
  adminupdatequestionOption,
  adminblockquestionOption,
  adminunblockquestionOption,
};
