const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, default: "📦" },
    price: { type: Number, required: true },
    activePrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const shippingSchema = new mongoose.Schema(
  {
    consigneeName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: { type: [orderItemSchema], required: true },
    shipping: { type: shippingSchema, required: true },
    region: { type: String, default: "AE" },
    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal", "telebirr", "mpesa"],
      required: true,
    },
    itemsSubtotal: { type: Number, required: true },
    discountDeduction: { type: Number, default: 0 },
    promoCode: { type: String, default: "" },
    freightCost: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Processing", "In Transit", "Delivered Complete", "Cancelled / Refunded"],
      default: "Processing",
    },
    trackingNumber: {
      type: String,
      unique: true,
    },
    courier: { type: String, default: "" },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

// Auto-generate tracking number before save
orderSchema.pre("save", function (next) {
  if (!this.trackingNumber) {
    this.trackingNumber = `MK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
