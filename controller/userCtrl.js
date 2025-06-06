const { generateToken } = require("../config/jwtToken");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const uniqid = require("uniqid");
const { send } = require("process");
const { sendEmail } = require("./emailCtrl");
const { cursorTo } = require("readline");
//Create user
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const findUserByEmail = await User.findOne({ email });
  const findUserByUsername = await User.findOne({ username });
  if (findUserByEmail) {
    throw new Error("Email already exists");
  }

  if (findUserByUsername) {
    throw new Error("Username already exists");
  }

  const newUser = await User.create({
    username,
    email,
    password,
  });
  await newUser.save();
  res.json(newUser);
});
//Login user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
   console.log("Email:", username, "Password:", password);
  const findUser = await User.findOne({ username });
   console.log("User found:", findUser);
  if (findUser && findUser.isPasswordMatched(password)) {
    const refreshToken = await generateRefreshToken(findUser?.id);
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      fullname: findUser?.fullname,
      username: findUser?.username,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id), // Assuming generateToken is imported from jwtToken.js
    });
  } else {
    throw new Error("Invalid credentials");
  }
});

//Admin login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await User.findOne({ email });
  if (findAmind.role !== "admin") {
    throw new Error("Not authorized, you are not an admin");
  }
  if (findAdmin && findAdmin.isPasswordMatched(password)) {
    const refreshToken = await generateRefreshToken(findAdmin?.id);
    const updateUser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id), // Assuming generateToken is imported from jwtToken.js
    });
  } else {
    throw new Error("Invalid credentials");
  }
});
//Get all users
const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});
//Get a single user
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  // console.log(id);
  try {
    const getaUser = await User.findById(id);
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});
//Delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  // console.log(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({
      deleteUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});
// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("No refresh token in cookies");
  }
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw new Error("No refresh token found in database or user not found");
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with the refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({
      accessToken,
    });
  });
});
//Update a user
const updateaUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  // console.log(id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        fullname: req?.body?.fullname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
        password: req?.body?.password,
      },
      {
        new: true,
      }
    );
    res.json({
      updatedUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});
//Block a user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User blocked successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});
//Unblock a user
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  console.log("Unblock user ID:", id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User unblocked successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});
//logout user
const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("No refresh token in cookies");
  }
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);
});

//Update password
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = `Hi, please follow this link to reset your password. This link is valid for 10 minutes. <a href='http://localhost:3002/api/user/reset-password/${token}'>Click here</a>`;
    const data = {
      to: email,
      text: "Hey user",
      subject: "Forgot Password Link",
      html: resetUrl,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token expired, please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let products = [];
    const userCart = await User.findById(_id);
    const alreadyExists = await Cart.findOne({ orderBy: _id });
    //Nếu đã có giỏ hàng thì xóa giỏ hàng cũ
    if (alreadyExists) {
      await alreadyExists.deleteOne();
    }
    //Duyệt qua từng sản phẩm trong giỏ hàng
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.quantity = cart[i].quantity;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    //Tính tổng giá trị giỏ hàng
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].quantity;
    }
    let newCart = await new Cart({
      product: products,
      CartTotal: cartTotal,
      orderBy: userCart?._id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({ orderBy: _id }).populate(
      "product.product","_id title price images");
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndDelete({ orderBy: user._id });
    res.json(user.cart);
  } catch (error) {
    throw new Error(error);
  }
});

const userCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  const validateCoupon = await Coupon.findOne({ name: coupon });
  if (!validateCoupon) {
    throw new Error("Invalid coupon");
  }
  const user = await User.findOne({ _id });
  let { products, CartTotal } = await Cart.findOne({ orderBy: user._id }).populate("product.product");
  let totalAfterDiscount = (
    CartTotal - (CartTotal * validateCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderBy: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  if (!COD) {
    throw new Error("Create cash order failed");
  }
  const user = await User.findById(_id);
  validateMongoDbId(_id);
  try {
    if (!COD) {
      throw new Error("Create cash order failed");
    }
    const user = await User.findById(_id);
    const userCart = await Cart.findOne({ orderBy: user._id });
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    }
    else {
      finalAmount = userCart.CartTotal;
    }

    let newOrder = await new Order({
      products: userCart.product,
      paymentIntend: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "vnd",
      },
      orderBy: user._id,
      orderStatus: "Cash on Delivery",
    }).save();
    let update = userCart.product.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json(newOrder);
  } catch (error) {
    throw new Error(error);
  }
});

const getOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const orders = await Order.find({ orderBy: _id }).populate("products.product");
    res.json(orders);
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  validateMongoDbId(orderId);
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteUser,
  updateaUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  userCart,
  getUserCart,
  loginAdmin,
  emptyCart,
  userCoupon,
  createOrder,
  getOrder,
  updateOrderStatus,
};
