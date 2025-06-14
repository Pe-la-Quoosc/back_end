const express = require("express");
const router = express.Router();
const { createReview, getReviewsByProduct } = require("../controller/reviewCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");



router.post("/create", authMiddleware, createReview);
router.get("/:productId", getReviewsByProduct);

module.exports = router;
