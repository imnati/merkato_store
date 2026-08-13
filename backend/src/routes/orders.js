const express = require("express");
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(protect, admin, getOrders).post(protect, createOrder);
router
  .route("/:id")
  .get(protect, getOrderById)
  .put(protect, admin, updateOrderStatus);

module.exports = router;
