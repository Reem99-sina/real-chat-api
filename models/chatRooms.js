const { DataTypes } = require("sequelize");
const sequelize = require("../connect/connectDb");

const Chat = sequelize.define(
  "Chat",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("private", "group"),
      defaultValue: "private",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "ChatRooms",
    modelName: "ChatRooms",
    timestamps: false,
  }
);

// 🔗 Relationship
Chat.associate = (models) => {
  Chat.belongsTo(models.User, { foreignKey: "created_by", as: "creator" });
  Chat.hasMany(models.ChatMembers, {
    foreignKey: "chat_id",
    as: "members",
  });

};

module.exports = Chat;
