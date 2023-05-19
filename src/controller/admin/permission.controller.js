const models = require("../../../models/index");
const { success, errorResponse } = require("../../utils/constants");
module.exports = {
  //This service is responsible for creating a permission in the database
  createPermission: async (req, res, next) => {
    try {
      const Permission = await models.Role.create({
        name: req.body.name,
        permission: req.body.permission,
      });
      if (Permission) {
        return res
          .status(201)
          .json(success("Permission created successfully", res.statusCode));
      } else {
        return res
          .status(404)
          .json(errorResponse("Permission creation failed", res.statusCode));
      }
    } catch (error) {
      return res.status(500).json(errorResponse(error.message, res.statusCode));
    }
  },

  //This service is responsible for getting all the permissions from the database
  getAllPermission: async (req, res, next) => {
    try {
      const pageSize = req.query.pageSize; // number of records per page
      const page = req.query.page; // the current page number
      const offset = (page - 1) * pageSize;
      const allPermissions = await models.Role.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        limit: pageSize || null,
        offset: offset || null,
      });
      if (allPermissions.length > 0) {
        return res.status(200).json(success(allPermissions, res.statusCode));
      } else {
        return res
          .status(404)
          .json(errorResponse("Permission Not Found", res.statusCode));
      }
    } catch (error) {
      return res.status(500).json(errorResponse(error.message, res.statusCode));
    }
  },

  //This service is responsible for getting a single permission from the database
  getPermission: async (req, res, next) => {
    try {
      const PermissionId = req.params.permissionId;
      if (!PermissionId) {
        return res.status(404).json(errorResponse("Invalid Id", 404));
      }
      const Permission = await models.Role.findOne({
        where: {
          id: PermissionId,
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (Permission && PermissionId) {
        return res.status(200).json(success(Permission, res.statusCode));
      } else {
        return res
          .status(404)
          .json(errorResponse("Permission Not Found", res.statusCode));
      }
    } catch (error) {
      return res.status(500).json(errorResponse(error.message, res.statusCode));
    }
  },

  //This service is responsible for updating a permissions in the database
  updatePermission: async (req, res) => {
    try {
      const PermissionId = req.params.permissionId;
      const { name, permission } = req.body;
      const updatedPermission = await models.Role.update(
        {
          name: name,
          permission: permission,
        },
        {
          where: {
            id: PermissionId,
          },
        }
      );
      if (updatedPermission != 0) {
        return res
          .status(200)
          .json(success("Permission Updated", res.statusCode));
      } else {
        return res
          .status(404)
          .json(errorResponse("Permission Not Found", res.statusCode));
      }
    } catch (error) {
      return res.status(500).json(errorResponse(error.message, res.statusCode));
    }
  },

  //This service is responsible for deleting a permissions from the database
  deletePermission: async (req, res, next) => {
    try {
      const PermissionId = req.params.permissionId;
      const deletedPermission = await models.Role.destroy({
        where: {
          id: PermissionId,
        },
      });
      if (deletedPermission) {
        return res
          .status(200)
          .json(success("Permission Deleted", res.statusCode));
      } else {
        return res
          .status(404)
          .json(errorResponse("Permission Not Found", res.statusCode));
      }
    } catch (error) {
      return res.status(500).json(errorResponse(error.message, res.statusCode));
    }
  },
};
