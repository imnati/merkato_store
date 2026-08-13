const Order = require("../models/Order");
const asyncHandler = require("../middleware/asyncHandler");

// POST /api/orders  — place a new order (logged in user)
const createOrder = async (req, res) => {
  const { items, total, destination, courier } = req.body;
  if (!items || items.length === 0)
    return res.status(400).json({ message: "No items in order" });

  const order = await Order.create({
    user: req.user._id,
    items,
    total,
    destination,
    courier,
  });
  res.status(201).json(order);
};

// GET /api/orders/my  — logged in user sees their own orders
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "items.product",
    "name images"
  );
  res.json(orders);
};

// GET /api/orders  — admin sees all orders
const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("items.product", "name");
  res.json(orders);
};

// PUT /api/orders/:id/status  — admin updates order status
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};

module.exports = {
  createOrder: asyncHandler(createOrder),
  getMyOrders: asyncHandler(getMyOrders),
  getAllOrders: asyncHandler(getAllOrders),
  updateOrderStatus: asyncHandler(updateOrderStatus),
};
