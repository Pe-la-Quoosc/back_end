const express = require("express");
const { addToCart, getCartByUserId, updateCartItem, deleteCartItem, clearCart } = require("../controller/cartCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();


router.post("/add", authMiddleware, addToCart);
router.get("/user",authMiddleware,getCartByUserId);
router.patch("/update", authMiddleware, updateCartItem); 
router.delete("/delete/:productId", authMiddleware, deleteCartItem); 
router.delete("/clear", authMiddleware, clearCart); 

module.exports = router;