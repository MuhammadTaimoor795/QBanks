const Joi = require("joi");
const { validation } = require("../utils/constants");

const validationSchemaQuery = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.query);
      next();
    } catch (error) {
      const message = error.message.replace(/"/g, "");
      return res.status(422).json(validation(message));
    }
  };
};

// User Dragon Object

const schemas = {
  marketplace: {
    details: Joi.object({
      type: Joi.string().valid("dragon", "attribute").required(),
      id: Joi.number().required(),
    }),
    // update: Joi.object({
    //   gems: Joi.number().optional(),
    //   price: Joi.number().optional(),
    //   type: Joi.string().optional(),
    // }),
  },
};
module.exports = { validationSchemaQuery, schemas };
