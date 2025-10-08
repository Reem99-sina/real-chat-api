const express = require("express");
const router = express.Router();
// const userController = require("../controllers/userController");
const validateUser = require("./user.validation");
const {
  signup,
  signin,
  profile,
  editProfile,
  sendcode,
  Checkcode,
  newPassword
} = require("./user.service");
const { validation } = require("../../Middleware/validation");
const { auth } = require("../../Middleware/auth");


router.post("/signup", validation(validateUser.signupvalidation), signup);
router.post("/signin", validation(validateUser.signinvalidation), signin);
router.get("/profile", auth(), profile);
router.patch("/profile", auth(), editProfile);

router.patch(
  "/send-code",
  validation(validateUser.sendcodevalidation),
  sendcode
);
router.patch(
  "/check-code",
  validation(validateUser.checkCodevalidation),
  Checkcode
);
router.patch(
  "/new-password",
  validation(validateUser.newPasswordvalidation),
  newPassword
);


module.exports = router;
