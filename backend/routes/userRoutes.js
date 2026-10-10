const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateProfile);
router.put("/me/password", authMiddleware, changePassword);

module.exports = router;
