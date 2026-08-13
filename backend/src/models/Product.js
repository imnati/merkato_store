const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Please enter brand name"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please enter category"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please enter price"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
    },
    sku: {
      type: String,
      required: [true, "Please enter SKU"],
      unique: true,
      uppercase: true,
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
