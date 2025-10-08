// socket.js
const { Message } = require("./models");
const User = require("./models/user");
let io;

module.exports = {
  init: (server) => {
    io = require("socket.io")(server, {
      cors: { origin: "*" },
    });

    io.on("connection", async (socket) => {
      const userId = socket.handshake.query.userId;
      console.log("🔥 New client connected:", socket.id, userId);

      // When user connects
      if (userId) {
        const user = await User.findByPk(userId);
        if (user) {
          user.status = "online";
          await user.save();
          console.log(`✅ ${user.name || "User"} is now online`);
        }
      }

      // When user disconnects
      socket.on("disconnect", async () => {
        console.log("❌ Client disconnected:", socket.id);

        if (userId) {
          const user = await User.findByPk(userId);
          if (user) {
            user.status = "offline";
            user.lastSeen = new Date();
            await user.save();
            console.log(`🕒 ${user.name || "User"} went offline`);
          }
        }
      });
      socket.on("joinChat", async (chatId) => {
        socket.join(`chat_${chatId}`);
        console.log(`User joined chat_${chatId}`);
        await Message.update(
          { status: "delivered" },
          {
            where: {
              chat_id: chatId,
              status: "sent",
            },
          }
        );

        // Notify others in chat
        io.to(`chat_${chatId}`).emit("messageDelivered", { chatId });
      });
      socket.on("seenMessages", async (chatId) => {
        await Message.update(
          { status: "seen" },
          {
            where: {
              chat_id: chatId,
              status: "delivered",
            },
          }
        );

        io.to(`chat_${chatId}`).emit("messageSeen", { chatId });
      });
      socket.on("sendMessage", async ({ chatId, senderId, content }) => {
        try {
          // 1️⃣ Save message in DB
          const newMessage = await Message.create({
            chat_id: chatId,
            sender_id: senderId,
            content,
            status: "sent",
          });

          // 2️⃣ Fetch sender info for broadcast
          const fullMessage = await Message.findByPk(newMessage.id, {
            include: [
              {
                model: User,
                as: "user",
                attributes: ["id", "name", "email", "status", "lastSeen"],
              },
            ],
          });

          // 3️⃣ Emit to all members in that chat room
          io.to(`chat_${chatId}`).emit("newMessage", fullMessage);

          // 4️⃣ Optionally mark as "delivered"
          await newMessage.update({ status: "delivered" });
        } catch (err) {
          console.error("sendMessage error:", err);
        }
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error("❌ Socket.io not initialized!");
    }
    return io;
  },
};
