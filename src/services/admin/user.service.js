const models = require("../../../models/index");
const { Op } = require("sequelize");
const { ApiError } = require("../../utils/error");
const { findQbanksByid } = require("../user/user.qbanks.service");

const findUserByEmailAdmin = async (email) => {
  email = email.toLowerCase();
  let dbUser = await models.User.findOne({
    where: {
      email: email,
    },
  });
  return dbUser;
};

const unblockUserAdmin = async (id) => {
  let user = await findUserByIdAdmin(id);
  if (user) {
    let unblock = await models.User.update(
      { isBlocked: false },
      { where: { id: id } }
    );
    if (unblock) {
      return true;
    }
  }
};
const activateUserAccount = async (id) => {
  let user = await findUserByIdAdmin(id);
  if (user) {
    let active = await models.User.update(
      { isActive: true },
      { where: { id: id } }
    );
    if (active) {
      return true;
    }
  }
};
const blockUserAdmin = async (id) => {
  let user = await findUserByIdAdmin(id);
  if (user) {
    let block = await models.User.update(
      { isBlocked: true },
      { where: { id: id } }
    );
    if (block) {
      return true;
    }
  }
};

const findUserByIdAdmin = async (id) => {
  let user = await models.User.findOne({
    where: {
      id,
    },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  if (user) {
    return user;
  } else {
    throw new ApiError("User Not Found  ", {
      status: 404,
    });
  }
};

// const assignqbanksAdmin = async (qbankid, id) => {
//   await findUserByIdAdmin(id);
//   await findQbanksByid(qbankid);

//   let qbank = await models.UserQbank.create({
//     UserId: id,
//     QBankId: qbankid,
//   });

//   if (qbank) {
//     return true;
//   }
// };

module.exports = {
  findUserByEmailAdmin,
  blockUserAdmin,
  unblockUserAdmin,
  findUserByIdAdmin,
  activateUserAccount,
  // assignqbanksAdmin,
};
