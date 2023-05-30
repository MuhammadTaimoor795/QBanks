require("dotenv").config();
const models = require("../../../models/index");

const { success, errorResponse } = require("../../utils/constants");
const {
  unblockUserAdmin,
  findUserByIdAdmin,
  blockUserAdmin,
  activateUserAccount,
  assignqbanksAdmin,
} = require("../../services/admin/user.service");

module.exports = {
  getAllUsers: async (req, res, next) => {
    try {
      const pageSize = req.query.pageSize; // number of records per page
      const page = req.query.page; // the current page number
      const offset = (page - 1) * pageSize;
      const where = {};

      const active = req.query.active;
      if (active === true) {
        where.isActive = true;
      } else {
        if (active === false) {
          where.isActive = false;
        }
      }
      const users = await models.User.findAll({
        where,

        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: models.UserQbank,
            include: [
              {
                model: models.QBanks,
              },
            ],
          },
        ],

        limit: pageSize || null,
        offset: offset || null,
      });
      if (users.length > 0) {
        return res.status(200).json(success(users, res.statusCode));
      } else {
        return res
          .status(404)
          .json(errorResponse("User Not Found", res.statusCode));
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

  getUser: async (req, res, next) => {
    try {
      const id = req.params.id;
      let user = await findUserByIdAdmin(id);
      if (user) {
        return res.status(200).json(success(user, res.statusCode));
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

  UnBlockUser: async (req, res, next) => {
    try {
      const id = req.params.id;
      let user = await findUserByIdAdmin(id);
      if (user) {
        let unblock = await unblockUserAdmin(id);
        if (unblock) {
          return res
            .status(200)
            .json(success("User Unblock Successfully", res.statusCode));
        }
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

  BlockUser: async (req, res, next) => {
    try {
      const id = req.params.id;
      let user = await findUserByIdAdmin(id);
      if (user) {
        let block = await blockUserAdmin(id);
        if (block) {
          return res
            .status(200)
            .json(success("User block Successfully", res.statusCode));
        }
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
  ActiveUser: async (req, res, next) => {
    try {
      const id = req.params.id;
      let user = findUserByIdAdmin(id);
      if (user) {
        let active = await activateUserAccount(id);
        if (active) {
          return res
            .status(200)
            .json(success("Account Activate Successfully", res.statusCode));
        }
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
