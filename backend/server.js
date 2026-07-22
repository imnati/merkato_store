require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// CORS must be first
app.use(cors({ origin: "http://localhost:3000" }));

// Webhook needs raw body — must be before express.json()
app.post(
  "/api/payment/stripe/webhook",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    console.log("📩 Webhook received");
    next();
  },
  require("./controllers/paymentController").stripeWebhook
);

// JSON middleware for all other routes
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Merkato backend running" });
});

// Test route to confirm webhook path
app.get("/api/payment/stripe/webhook", (req, res) => {
  res.send("Webhook endpoint is reachable");
});

// Routes
app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders",   require("./routes/orderRoutes"));
app.use("/api/account",  require("./routes/accountRoutes"));
app.use("/api/reviews",  require("./routes/reviewRoutes"));
app.use("/api/payment",  require("./routes/paymentRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
