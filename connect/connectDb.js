const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "real_time_chat",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "12345678",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    logging: false,
  }
);

module.exports = sequelize; // ✅ export instance only