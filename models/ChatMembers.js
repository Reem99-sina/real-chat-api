const { DataTypes } = require("sequelize");
const sequelize = require("../connect/connectDb");

const ChatMembers = sequelize.define(
  "ChatMembers",
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "ChatMembers",
    modelName: "ChatMembers",
    timestamps: false,
  }
);

ChatMembers.associate = (models) => {
  ChatMembers.belongsTo(models.ChatRooms, {
    foreignKey: "chat_id",
    as: "chat",
  });
  ChatMembers.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "member",
  });
};
module.exports = ChatMembers;
