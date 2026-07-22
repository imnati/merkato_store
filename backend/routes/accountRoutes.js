const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, updatePassword } = require("../controllers/accountController");
const { protect } = require("../middleware/authMiddleware");

router.get("/",           protect, getProfile);
router.put("/",           protect, updateProfile);
router.put("/password",   protect, updatePassword);

module.exports = router;
