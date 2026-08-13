const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        image: String,
      },
    ],
    shippingAddress: {
      consigneeName: String,
      contactPhone: String,
      streetAddress: String,
      cityName: String,
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal", "cod"],
      default: "stripe",
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      enum: [
        "Processing",
        "In Transit",
        "Delivered Complete",
        "Cancelled / Refunded",
      ],
      default: "Processing",
    },
    courier: {
      type: String,
      default: "Regional Air Freight",
    },
    destination: {
      type: String,
      default: "Pan-African Terminal",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
