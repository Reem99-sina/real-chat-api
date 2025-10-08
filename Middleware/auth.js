const jwt = require("jsonwebtoken");
const userModel = require("../models/user");


module.exports.auth = () => {
  return async (req, res, next) => {
    try {
      const headerToken = req?.headers["authorization"];
      if (!headerToken?.startsWith(`${process.env.Bearer} `) || !headerToken) {
        res.status(400).json({ message: "in valid header token" });
      } else {
        const token = headerToken?.split(" ")[1];
        if (!token) {
          res.status(400).json({ message: "no token there" });
        } else {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          if (!decoded) {
            res.status(400).json({ message: "in valid token" });
          } else {
            const user = await userModel.findByPk(decoded.id);
            if (!user) {
              res.status(400).json({ message: "no user fonud" });
            } else {
              req.user = user;
              next();
            }
          }
        }
      }
    } catch (error) {
      res.status(400).json({ message: "error catch", error });
    }
  };
};


