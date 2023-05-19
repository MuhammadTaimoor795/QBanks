const models = require("../../../models/index");
const { Op } = require("sequelize");
const db = require("../../../models/index");
const { ApiError } = require("../../utils/error");
const sequelize = db.sequelize;

async function admincreateTest(qbankid, name, description, duration) {
  let findtest = await adminTestByname(name);
  if (findtest) {
    throw new ApiError("Test with this name already Exist", {
      status: 409,
    });
  }

  let createTest = await models.Test.create({
    QBankId: qbankid,
    name,
    description,
    duration,
  });
  if (createTest) {
    return true;
  }
}
async function adminTestByname(name) {
  let test = await models.Test.findOne({
    where: {
      name,
    },
    include: [
      {
        model: models.Question,
        include: [
          {
            model: models.Option,
          },
        ],
      },
    ],
  });
  if (test) {
    return test;
  } else {
    return false;
  }
}
async function adminqbanksTest(isactive, id) {
  const where = {};
  // if (isactive === "true") {
  //   console.log("yes");
  //   where.isactive = true;
  //   where.QBankId = id;
  // }
  // if (isactive == "false") {
  //   console.log("No");
  //   where.isactive = false;
  //   where.QBankId = id;
  // }
  where.QBankId = id;
  let test = await models.Test.findAll({
    where,
    include: [
      {
        model: models.Question,
        include: [
          {
            model: models.Option,
          },
        ],
      },
    ],
  });
  if (!test) {
    return [];
  } else {
    return test;
  }
}

async function adminfindTest(id) {
  let test = await models.Test.findOne({
    where: {
      id,
    },
    include: [
      {
        model: models.Question,
        include: [
          {
            model: models.Option,
          },
        ],
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

async function adminupdateTest(id, name, description, duration, id) {
  await adminqbanksTest(id);
  let test = await models.Test.update(
    { name, description, duration },
    { where: { id: id } }
  );
  if (test) {
    return true;
  }
}

async function adminblockTest(id) {
  await adminfindTest(id);
  let test = await models.Test.update(
    { isactive: false },
    { where: { id: id } }
  );
  if (test) {
    return true;
  }
}

async function adminunblockTest(id) {
  await adminfindTest(id);
  let test = await models.Test.update(
    { isactive: true },
    { where: { id: id } }
  );
  if (test) {
    return true;
  }
}

module.exports = {
  admincreateTest,
  adminqbanksTest,
  adminfindTest,
  adminupdateTest,
  adminblockTest,
  adminunblockTest,
};
