// user.route.js
const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../controllers/user.controller.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

module.exports = router;
