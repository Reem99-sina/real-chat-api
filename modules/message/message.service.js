const { ChatMembers, User, ChatRooms, Message } = require("../../models");
const { getIO } = require("../../socket");

module.exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;
    if (!chatId || !content) {
      return res.status(400).json({
        error: "chatId and content are required",
      });
    }
    let message = await Message.create({
      chat_id: chatId,
      content,
      sender_id: senderId,
    });
    const fullMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "status", "lastSeen"],
        },
      ],
    });

    getIO().to(`chat_${chatId}`).emit("newMessage", fullMessage);
    res.status(201).json({
      message: "send message",
      chat: message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "error request inputs",
      error: error,
    });
  }
};

module.exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.findAll({
      where: { chat_id: chatId },
      include: [
        {
          model: User,
          as: "user", 
          attributes: ["id", "name", "email", "status"],
        },
      ],
      order: [["created_at", "ASC"]],
    });
    res.status(200).json({
      message: "get chats of user ",
      messages: messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "error request inputs",
      error: error,
    });
  }
};

module.exports.addMemberToChat = async (req, res) => {
  try {
    const { chat_id, user_id } = req.body; 

    const chat = await ChatRooms.findByPk(chat_id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existing = await ChatMembers.findOne({
      where: { chat_id, user_id },
    });
    if (existing) {
      return res.status(400).json({ message: "User already a member" });
    }

    const member = await ChatMembers.create({
      chat_id,
      user_id,
    });

    const newMember = await ChatMembers.findByPk(member.id, {
      include: [{ model: User, as: "member" }],
    });

    res.status(201).json({
      message: "Member added successfully",
      member: newMember,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error adding member",
      error,
    });
  }
};

module.exports.getChatsById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const chats = await ChatRooms.findOne({
      where: { created_by: userId, id: id },
      include: [
        {
          model: ChatMembers,
          as: "members",
          include: [
            {
              model: User,
              as: "member",
            },
          ],
        },
      ],
    });
    res.status(200).json({
      message: "get chat of user ",
      chat: chats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "error request inputs",
      error: error,
    });
  }
};
