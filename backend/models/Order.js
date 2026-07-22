const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name:     { type: String },
  price:    { type: Number },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items:       [orderItemSchema],
    total:       { type: Number, required: true },
    status:      { type: String, enum: ["Processing", "In Transit", "Delivered Complete", "Cancelled / Refunded"], default: "Processing" },
    destination: { type: String },
    courier:     { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
