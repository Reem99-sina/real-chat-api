const express = require("express");
const { createChat, getChats, addMemberToChat, getChatsById } = require("./chat.service");
const { validation } = require("../../Middleware/validation");
const validateChat = require("../chat/chat.validation");
const { auth } = require("../../Middleware/auth");
const router = express.Router();

router.post(
  "/create-chat",
  auth(),
  validation(validateChat.CreateChatValidation),
  createChat
);
router.get("/chats", auth(), getChats);
router.get("/chats/:id", auth(), getChatsById);

router.post(
  "/add-member-chat",
  auth(),
  validation(validateChat.addMemberChatValidation),
  addMemberToChat
);

module.exports = router;
