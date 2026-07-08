const Product = require("../models/Product");

// GET /api/products
const getProducts = async (req, res) => {
  const { category, search, featured } = req.query;
  const filter = {};

  if (category && category !== "All") filter.category = category;
  if (featured === "true") filter.isFeatured = true;
  if (search) filter.name = { $regex: search, $options: "i" };

  const products = await Product.find(filter);
  res.json(products);
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

// POST /api/products  (admin)
const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

// PUT /api/products/:id  (admin)
const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

// DELETE /api/products/:id  (admin)
const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
