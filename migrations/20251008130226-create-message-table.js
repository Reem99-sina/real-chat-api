"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("message", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      chat_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ChatRooms", // must match your ChatRooms table name
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users", // must match your users table name
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      content: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.ENUM("sent", "delivered", "seen"),
        defaultValue: "sent",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop ENUM type first (important for Postgres / MySQL)
    await queryInterface.dropTable("message");
  },
};
