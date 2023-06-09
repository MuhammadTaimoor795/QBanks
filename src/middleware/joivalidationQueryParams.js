const Joi = require("joi");
const { validation } = require("../utils/constants");

const joivalidationQueryParams = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.params);
      next();
    } catch (error) {
      const message = error.message.replace(/"/g, "");
      return res.status(422).json(validation(message));
    }
  };
};

// User Dragon Object

const paramsSchema = {
  Qbanks: {
    userbanks: Joi.object({
      id: Joi.string().required(),
    }),
  },
  User: {
    resumetest: Joi.object({
      usertestid: Joi.string().required(),
    }),

    // update: Joi.object({
    //   gems: Joi.number().optional(),
    //   price: Joi.number().optional(),
    //   type: Joi.string().optional(),
    // }),
  },
  // update: Joi.object({
  //   gems: Joi.number().optional(),
  //   price: Joi.number().optional(),
  //   type: Joi.string().optional(),
  // }),
};
module.exports = { joivalidationQueryParams, paramsSchema };
