const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, updatePassword, addWishlist, removeWishlist } = require("../controllers/accountController");
const { protect } = require("../middleware/authMiddleware");

router.get("/",           protect, getProfile);
router.put("/",           protect, updateProfile);
router.put("/password",   protect, updatePassword);
router.put("/wishlist",   protect, addWishlist);
router.delete("/wishlist/:productId", protect, removeWishlist);

module.exports = router;
