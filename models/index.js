const ChatRooms = require("./chatRooms");
const ChatMembers = require("./ChatMembers");
const Message = require("./message");

const User = require("./user");

const models = { User, ChatRooms, ChatMembers,Message };

// Register associations
Object.values(models)
  .filter((model) => typeof model.associate === "function")
  .forEach((model) => model.associate(models));

module.exports = models;
