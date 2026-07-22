const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    nameAm:        { type: String },
    nameAr:        { type: String },
    brand:         { type: String, required: true },
    category:      { type: String, required: true },
    price:         { type: Number, required: true },
    discountPrice: { type: Number, default: null },
    sku:           { type: String, required: true, unique: true },
    images:        [{ type: String }],
    stock:         { type: Number, default: 0 },
    status:        { type: String, enum: ["In Stock", "Low Stock", "Out of Stock"], default: "In Stock" },
    isFeatured:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
