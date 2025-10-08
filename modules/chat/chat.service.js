const { ChatMembers, User, ChatRooms } = require("../../models");

module.exports.createChat = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({
        error: "name and type are required",
      });
    }
    let chat = await ChatRooms.create({
      name,
      type,
      created_by: id,
    });
    await ChatMembers.create({
      chat_id: chat?.id,
      user_id: id,
    });
    res.status(201).json({
      message: "create chat",
      chat: chat,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "error request inputs",
      error: error,
    });
  }
};

module.exports.getChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await ChatRooms.findAll({
      where: { created_by: userId },
      include: [
        {
          model: ChatMembers,
          as: "members",
          include: [
            {
              model: User,
              as: "member",
              attributes: ["id", "name", "status", "lastSeen"],
            },
          ],
        },
      ],
    });
    res.status(200).json({
      message: "get chats of user ",
      chats: chats,
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
    const { chat_id, user_id } = req.body; // from request body
    const currentUserId = req.user.id; // the creator or current user

    // ✅ Step 1: Verify that the chat exists
    const chat = await ChatRooms.findByPk(chat_id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // ✅ Step 2: Verify that the user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Step 3: Check if user already in chat
    const existing = await ChatMembers.findOne({
      where: { chat_id, user_id },
    });
    if (existing) {
      return res.status(400).json({ message: "User already a member" });
    }

    // ✅ Step 4: Add member
    const member = await ChatMembers.create({
      chat_id,
      user_id,
    });

    // ✅ Step 5: Optional: Include user info in response
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
               attributes: ["id", "name", "status", "lastSeen"],
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
