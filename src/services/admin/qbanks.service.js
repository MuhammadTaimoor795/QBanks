const models = require("../../../models/index");
const { Op } = require("sequelize");
const db = require("../../../models/index");
const { ApiError } = require("../../utils/error");
const sequelize = db.sequelize;

async function createQbanks(name, description, type) {
  let qbank = await models.QBanks.findOne({
    where: {
      name,
    },
  });
  if (qbank) {
    throw new ApiError("Qbank with this name already Exist", {
      status: 409,
    });
  }
  let createQbanks = await models.QBanks.create({
    name,
    description,
    type,
  });
  if (createQbanks) {
    return true;
  }
}

async function allQbanks() {
  // console.log("isactive", typeof Boolean(isactive));
  // const where = {};

  // if (isactive === "true") {
  //   console.log("yes");
  //   where.isactive = true;
  // }
  // if (isactive == "false") {
  //   console.log("No");
  //   where.isactive = false;
  // }

  let qbank = await models.QBanks.findAll({
    // where,
    include: [
      {
        model: models.Test,
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
      },
    ],
  });
  if (!qbank) {
    return [];
  } else {
    return qbank;
  }
}

async function findQbanksByidAdmin(id) {
  console.log("id", id);
  let qbank = await models.QBanks.findOne({
    where: {
      id,
    },
    include: [
      {
        model: models.Test,
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
      },
    ],
  });

  if (!qbank) {
    throw new ApiError("Qbank Not Found with this is ", {
      status: 400,
    });
  } else {
    console.log("qbank", qbank);
    return qbank;
  }
}

async function updateQbanks(name, description, type, id) {
  await findQbanksByid(id);
  let qbank = await models.QBanks.update(
    { name, description, type },
    { where: { id: id } }
  );
  if (qbank) {
    return true;
  }
}

async function deactiviteQbanks(id) {
  await findQbanksByidAdmin(id);
  let qbank = await models.QBanks.update(
    { isactive: false },
    { where: { id: id } }
  );
  if (qbank) {
    return true;
  }
}

async function activiteQbanks(id) {
  await findQbanksByidAdmin(id);
  let qbank = await models.QBanks.update(
    { isactive: true },
    { where: { id: id } }
  );
  if (qbank) {
    return true;
  }
}

// async function findUserByEmail(email) {
//   email = email.toLowerCase();
//   let dbUser = await models.User.findOne({
//     where: {
//       email: email,
//     },
//   });
//   return dbUser;
// }

module.exports = {
  createQbanks,
  allQbanks,
  findQbanksByidAdmin,
  updateQbanks,
  deactiviteQbanks,
  activiteQbanks,
};
