const { DataTypes } = require("sequelize");
const sequelize = require("../connect/connectDb");

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ChatRooms",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    content: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM("sent", "delivered", "seen"),
      defaultValue: "sent",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "message",
    modelName: "message",
    timestamps: false,
  }
);

// 🔗 Relationship
Message.associate = (models) => {
  Message.belongsTo(models.User, { foreignKey: "sender_id", as: "user" });
  Message.belongsTo(models.ChatMembers, { foreignKey: "chat_id", as: "chat" });
};

module.exports = Message;
