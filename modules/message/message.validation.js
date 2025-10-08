const joi = require("joi");

module.exports.CreateMessageValidation = {
  body: joi.object().required().keys({
    content: joi.string().required(),
  }),
  // created_by:joi.number().required()
};

module.exports.addMemberChatValidation = {
  body: joi.object().required().keys({
    chat_id: joi.number().required(),
    user_id: joi.number().required(),
  }),
  // created_by:joi.number().required()
};
