const Review = require("../models/Review");

// GET /api/reviews?product=:productId
const getReviews = async (req, res) => {
  const filter = req.query.product ? { product: req.query.product } : {};
  const reviews = await Review.find(filter).populate("user", "name");
  res.json(reviews);
};

// POST /api/reviews
const createReview = async (req, res) => {
  const { product, rating, comment } = req.body;

  const existing = await Review.findOne({ user: req.user._id, product });
  if (existing)
    return res.status(400).json({ message: "You already reviewed this product" });

  const review = await Review.create({
    user: req.user._id,
    product,
    rating,
    comment,
  });
  res.status(201).json(review);
};

// DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: "Review not found" });

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin")
    return res.status(403).json({ message: "Not allowed" });

  await review.deleteOne();
  res.json({ message: "Review deleted" });
};

module.exports = { getReviews, createReview, deleteReview };
