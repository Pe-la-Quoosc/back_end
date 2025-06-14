const Review = require("../models/reviewModel");
const asyncHandler = require("express-async-handler");

// Tạo đánh giá
const createReview = asyncHandler(async (req, res) => {
  console.log("Creating review:", req);
  const { productId, rating, comment } = req.body;

  if (!productId || !rating) {
    return res.status(400).json({ message: "Product ID and rating are required" });
  }

  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existingReview) {
    return res.status(400).json({ message: "You have already reviewed this product" });
  }

  const review = new Review({
    user: req.user._id,
    product: productId,
    rating,
    comment,
  });

  await review.save();
  res.status(201).json({ message: "Review created successfully", review });
});

// Lấy danh sách đánh giá theo sản phẩm
const getReviewsByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  console.log("Product Id:",productId);
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  const reviews = await Review.find({ product: productId }).populate("user", "name");
  res.status(200).json(reviews);
});

module.exports = { createReview, getReviewsByProduct };