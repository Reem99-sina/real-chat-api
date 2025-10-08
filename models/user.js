const { DataTypes } = require("sequelize");
const sequelize = require("../connect/connectDb"); // your sequelize instance
const bcrypt = require("bcrypt");
const ChatMembers = require("./ChatMembers");

const User = sequelize.define(
  "User",
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
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("online", "offline"),
      defaultValue: "offline",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    confirmed: {
      // ✅ new property
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    codecheck: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastSeen: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: false, // disable auto createdAt/updatedAt
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(
          user.password,
          Number(process.env.saltsofround)
        );
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(
            user.password,
            Number(process.env.saltsofround)
          );
        }
      },
    },
  }
);
User.associate = (models) => {
  User.hasMany(models.ChatMembers, {
    foreignKey: "user_id",
    as: "user",
  });
  
 User.hasMany(models.ChatRooms, { foreignKey: "created_by", as: "creator" });
};

module.exports = User;
