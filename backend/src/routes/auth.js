const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  getMe,
  updateUserRole,
} = require("../controllers/authController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/:id/role", protect, admin, updateUserRole);

module.exports = router;
