const models = require("../../../models/index");
const { Op } = require("sequelize");
const db = require("../../../models/index");
const { ApiError } = require("../../utils/error");

async function findQbanksByid(id) {
  let qbank = await models.QBanks.findOne({
    where: {
      id,
      isactive: true,
    },
  });

  if (!qbank) {
    throw new ApiError("Qbank Not Found with this is Id Or Blocked By Admin", {
      status: 400,
    });
  } else {
    console.log("yes qbanks found");
    return qbank;
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
  findQbanksByid,
};
