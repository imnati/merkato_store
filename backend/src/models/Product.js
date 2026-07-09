const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameAm: { type: String, default: "" },
    nameAr: { type: String, default: "" },
    description: { type: String, default: "" },
    brand: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Fashion & clothing",
        "Groceries",
        "Beauty products",
        "Household items",
        "Accessories",
      ],
    },
    subcategory: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: null },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, required: true, unique: true, uppercase: true },
    images: { type: [String], default: ["📦"] },
    status: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Low Stock"],
      default: "In Stock",
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-update status based on stock
productSchema.pre("save", function (next) {
  if (this.stockQuantity <= 0) this.status = "Out of Stock";
  else if (this.stockQuantity < 5) this.status = "Low Stock";
  else this.status = "In Stock";
  next();
});

module.exports = mongoose.model("Product", productSchema);
