const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, region } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(400).json({ message: "Email already registered" });

  // Secret admin code — read from environment, only team knows this
  const role =
    req.body.adminCode === process.env.ADMIN_SECRET_CODE ? "admin" : "user";

  const user = await User.create({ name, email, password, region, role });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    region: user.region,
    token: generateToken(user._id),
  });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid email or password" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    region: user.region,
    token: generateToken(user._id),
  });
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // Always return success so we don't leak which emails exist
  res.json({ message: "If that email exists, a reset link has been sent." });
};

module.exports = {
  register: asyncHandler(register),
  login: asyncHandler(login),
  forgotPassword: asyncHandler(forgotPassword),
};
