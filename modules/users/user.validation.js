const joi = require("joi");

module.exports.signupvalidation = {
  body: joi
    .object()
    .required()
    .keys({
      name: joi
        .string()
        .required()
        .pattern(new RegExp(/[a-z]{1,5}$/)),
      email: joi.string().email().required(),
      password: joi
        .string()
        .required().min(8),
      role: joi.string().default("user"),
    }),
};

module.exports.confirmvalidation = {
  params: joi.object().required().keys({
    token: joi.string().required(),
  }),
};

module.exports.signinvalidation = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required(),
      password: joi
        .string()
        .required().min(8),
    }),
};

module.exports.sendcodevalidation = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required()
    }),
};

module.exports.checkCodevalidation = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required(),
      code: joi.number().required()
    }),
};

module.exports.newPasswordvalidation = {
  body: joi
    .object()
    .required()
    .keys({
      
      email: joi.string().email().required(),
      password: joi
        .string()
        .required().min(8),
    }),
};