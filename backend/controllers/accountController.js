const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// GET /api/account
const getProfile = async (req, res) => {
  res.json(req.user);
};

// PUT /api/account
const updateProfile = async (req, res) => {
  const { name, region, addresses } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, region, addresses },
    { new: true }
  ).select("-password");
  res.json(user);
};

// PUT /api/account/password
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!(await user.matchPassword(currentPassword)))
    return res.status(400).json({ message: "Current password is incorrect" });

  user.password = newPassword;
  await user.save();
  res.json({ message: "Password updated" });
};

// PUT /api/account/wishlist  { productId }
const addWishlist = async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: "Product ID is required" });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: productId } },
    { new: true }
  ).select("-password");
  res.json(user.wishlist);
};

// DELETE /api/account/wishlist/:productId
const removeWishlist = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: req.params.productId } },
    { new: true }
  ).select("-password");
  res.json(user.wishlist);
};

module.exports = {
  getProfile: asyncHandler(getProfile),
  updateProfile: asyncHandler(updateProfile),
  updatePassword: asyncHandler(updatePassword),
  addWishlist: asyncHandler(addWishlist),
  removeWishlist: asyncHandler(removeWishlist),
};
