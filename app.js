require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const { init } = require("./socket");
const sequelize = require("./connect/connectDb");
const UserRouter = require("./modules/users/userRoutes");
const ChatRouter = require("./modules/chat/chat.routes");
const MessageRouter = require("./modules/message/message.routes");

const { validation } = require("./Middleware/validation");
const { confirm } = require("./modules/users/user.service");
const validateUser=require("./modules/users/user.validation")

app.use(express.json());
app.use(cors()); // ✅ fixed
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(
  "/api/v1/user",
  (req, res, next) => {
    next();
  },
  UserRouter
);
app.use(
  "/api/v1/chat",
  (req, res, next) => {
    next();
  },
  ChatRouter
);  
app.use(
  "/api/v1/message",
  (req, res, next) => {
    next();
  },
  MessageRouter
); 
app.get("/confirm/:token", validation(validateUser.confirmvalidation), confirm);

(async () => {
  try {
    await sequelize.authenticate();

    await sequelize.sync();

    const server = app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });

    init(server);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();