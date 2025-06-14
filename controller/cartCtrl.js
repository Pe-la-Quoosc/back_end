const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, selectedAttributes } = req.body; 
  const { _id } = req.user; 

  try {
    let cart = await Cart.findOne({ orderBy: _id }); 

    if (!cart) {
      cart = await Cart.create({
        orderBy: _id,
        products: [],
      });
    }

    if (!Array.isArray(cart.products)) {
      cart.products = [];
    }
    const existingProductIndex = cart.products.findIndex(
      (item) =>
        item.product.toString() === productId &&
        JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
    );

    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      const product = await Product.findById(productId).select("price");
      if (!product) {
        throw new Error("Product not found");
      }
      cart.products.push({
        product: productId,
        quantity: quantity,
        price: product.price,
        selectedAttributes,
      });
    }
    cart.CartTotal = cart.products.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    await cart.save(); 
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to add product to cart" });
  }
});

const getCartByUserId = asyncHandler(async (req, res) => {
  const { _id } = req.user; 
  try {
    const cart = await Cart.findOne({ orderBy: _id }).populate("products.product","_id title price images"); 
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart); 
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch cart" });
  }
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity, selectedAttributes } = req.body; // Thêm selectedAttributes vào request body
  const { _id } = req.user;

  try {
    const cart = await Cart.findOne({ orderBy: _id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Tìm sản phẩm trong giỏ hàng dựa trên productId và selectedAttributes
    const itemIndex = cart.products.findIndex(
      (item) =>
        item.product.toString() === productId &&
        JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Cập nhật số lượng sản phẩm
    cart.products[itemIndex].quantity = quantity;

    // Cập nhật tổng giá trị giỏ hàng
    cart.CartTotal = cart.products.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update cart item" });
  }
});

const deleteCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params; 
  const { selectedAttributes } = req.body; 
  const { _id } = req.user; 

  try {
    const cart = await Cart.findOne({ orderBy: _id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (item) =>
        item.product.toString() !== productId ||
        JSON.stringify(item.selectedAttributes) !== JSON.stringify(selectedAttributes)
    );

    await cart.save(); 
    res.json(cart); 
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete cart item" });
  }
});

const clearCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const cart = await Cart.findOne({ orderBy: _id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to clear cart" });
  }
});

module.exports = { addToCart, getCartByUserId,updateCartItem,deleteCartItem,clearCart };
