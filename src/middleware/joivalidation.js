const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");
const { join } = require("path");
const { validation, StudentMode } = require("../utils/constants");

const validationSchema = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      const message = error.message.replace(/"/g, "");
      return res.status(422).json(validation(message));
    }
  };
};

const optionSchema = Joi.object({
  name: Joi.string().required(),
  isTrue: Joi.boolean().required(),
});

const questionSchema = Joi.array().items(
  Joi.object({
    description: Joi.string().required(),
    explanation: Joi.string().required(),
    options: Joi.array().items(optionSchema).min(2).required(),
  })
);
const decimalPattern = /^\d{1,8}(\.\d{1,2})?$/; // Pattern for up to 8 digits with up to 2 decimal places

const schemas = {
  user: {
    create: Joi.object({
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: new PasswordComplexity({
        min: 8,
        max: 25,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
      }),
      confirmpassword: Joi.string().required().valid(Joi.ref("password")),
      description: Joi.string().required(),
      country: Joi.string().required(),

      //
    }),
    resetPassword: Joi.object({
      password: new PasswordComplexity({
        min: 8,
        max: 25,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
      }),
      confirmpassword: Joi.string().required().valid(Joi.ref("password")),
    }),
    changePassword: Joi.object({
      oldpassword: new PasswordComplexity({
        min: 8,
        max: 25,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
      }),
      password: new PasswordComplexity({
        min: 8,
        max: 25,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
      }),
      confirmpassword: Joi.string().required().valid(Joi.ref("password")),
    }),
    update: Joi.object({
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: new PasswordComplexity({
        min: 8,
        max: 25,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
      }),
      confirmpassword: Joi.string().required().valid(Joi.ref("password")),
    }),
    login: Joi.object({
      email: Joi.string().email().required(),
      password: new PasswordComplexity({
        min: 8,
        max: 25,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
      }),
    }),
    newtest: Joi.object({
      testid: Joi.string().required(),
      // duration: Joi.number(),
      mode: Joi.string()
        .valid(...Object.values(StudentMode))
        .required(),
    }),
    pausetest: Joi.object({
      usertestid: Joi.string().required(),
      timeleft: Joi.number(),
    }),

    evulatetest: Joi.object({
      questions: Joi.array()
        .items(
          Joi.object({
            uuid: Joi.string().required(),
            istrue: Joi.boolean(),
            optionid: Joi.array().items(Joi.string()),
          })
        )
        .required(),
    }),
    refreshtoken: Joi.object({
      token: Joi.string().required(),
    }),
  },
  Qbanks: {
    create: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      type: Joi.string().required(),
    }),
    user: Joi.object({
      userid: Joi.string().required(),
      qbankid: Joi.string().required(),
    }),
  },

  Test: {
    create: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      qbankid: Joi.string().required(),
    }),
    update: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      testid: Joi.string().required(),
    }),
    bulkcreate: Joi.object({
      qbankid: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      question: questionSchema.required(),
    }),
  },
  Question: {
    create: Joi.object({
      testid: Joi.string().required(),
      description: Joi.string().required(),
      options: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().required(),
            isTrue: Joi.boolean().required(),
          })
        )
        .min(1)
        .required(),
    }),
    update: Joi.object({
      questionid: Joi.string().required(),
      description: Joi.string().required(),
    }),
  },
  Option: {
    create: Joi.object({
      questionid: Joi.string().required(),
      name: Joi.string().required(),
      istrue: Joi.boolean().required(),
    }),
    update: Joi.object({
      optionid: Joi.string().required(),
      name: Joi.string().required(),
      istrue: Joi.boolean().required(),
    }),
  },
};
module.exports = { validationSchema, schemas };
