const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name images stockQuantity status"
  );

  if (!cart) {
    return res.json({ success: true, data: { items: [], totalItems: 0, totalCost: 0 } });
  }

  res.json({
    success: true,
    data: {
      items: cart.items,
      totalItems: cart.totalItems,
      totalCost: cart.totalCost,
    },
  });
});

// @desc    Add item to cart or increase quantity
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.stockQuantity <= 0) {
    res.status(400);
    throw new Error("Product is out of stock");
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingIndex >= 0) {
    const newQty = cart.items[existingIndex].quantity + quantity;
    if (newQty > product.stockQuantity) {
      res.status(400);
      throw new Error(`Only ${product.stockQuantity} units available`);
    }
    cart.items[existingIndex].quantity = newQty;
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || "📦",
      price: product.price,
      activePrice: product.discountPrice || product.price,
      quantity,
    });
  }

  await cart.save();
  res.json({ success: true, data: cart });
});

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );
  if (itemIndex < 0) {
    res.status(404);
    throw new Error("Item not in cart");
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    const product = await Product.findById(productId);
    if (quantity > product.stockQuantity) {
      res.status(400);
      throw new Error(`Only ${product.stockQuantity} units available`);
    }
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();
  res.json({ success: true, data: cart });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== req.params.productId
  );

  await cart.save();
  res.json({ success: true, data: cart });
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: [] },
    { new: true }
  );
  res.json({ success: true, message: "Cart cleared" });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
