const express = require("express");
const { sendMessage, getMessages } = require("./message.service");
const { validation } = require("../../Middleware/validation");
const validateChat = require("../message/message.validation");
const { auth } = require("../../Middleware/auth");
const router = express.Router();

router.post(
  "/:chatId/send-message",
  auth(),
  validation(validateChat.CreateMessageValidation),
  sendMessage
);
router.get(
  "/:chatId/messages",
  auth(),
  getMessages
);
// router.get("/chats", auth(), getChats);
// router.get("/chats/:id", auth(), getChatsById);

// router.post(
//   "/add-member-chat",
//   auth(),
//   validation(validateChat.addMemberChatValidation),
//   addMemberToChat
// );

module.exports = router;
