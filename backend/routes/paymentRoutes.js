const express = require("express");
const router = express.Router();
const { createStripeSession } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

// Create Stripe checkout session (protected)
router.post("/stripe/create-session", protect, createStripeSession);

module.exports = router;
