const User = require("../models/User");

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

module.exports = { getProfile, updateProfile, updatePassword };
