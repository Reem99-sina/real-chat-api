const joi = require("joi");

module.exports.CreateChatValidation = {
  body: joi
    .object()
    .required()
    .keys({
      name: joi
        .string()
        .required()
        .pattern(new RegExp(/[a-z]{1,5}$/)),
      type: joi
        .string()
        .valid("private", "group")
        .default("private")
        .messages({
          "any.only": " status must be one of: private, group",
        })
        .required(),
   
    }),
    // created_by:joi.number().required()
};


module.exports.addMemberChatValidation = {
  body: joi
    .object()
    .required()
    .keys({
      chat_id: joi
        .number()
        .required(),
      user_id: joi
        .number()
        .required(),
   
    }),
    // created_by:joi.number().required()
};