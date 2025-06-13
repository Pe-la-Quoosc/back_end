const { generateToken } = require("../config/jwtToken");

const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("./emailCtrl");
const uniqid = require("uniqid");
const cartModel = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
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
  await cartModel.create({
    orderBy: newUser._id,
    products: [],
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
//Update user address
const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { address } = req.body;
  validateMongoDbId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: address,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
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




const userCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;

  // Tìm coupon không phân biệt hoa thường
  const validateCoupon = await Coupon.findOne({ name: coupon.toUpperCase(), isActive: true });
  if (!validateCoupon) {
    throw new Error("Invalid coupon");
  }

  // Kiểm tra hạn sử dụng
  if (new Date(validateCoupon.expiry) < new Date()) {
    throw new Error("Coupon has expired");
  }

  // Lấy cart của user
  const user = await User.findOne({ _id });
  let cart = await cartModel.findOne({ orderBy: user._id });
  if (!cart) throw new Error("Cart not found");

  let { CartTotal } = cart;

  // Kiểm tra giá trị đơn hàng tối thiểu
  if (CartTotal < (validateCoupon.minOrderValue || 0)) {
    throw new Error(`Order value must be at least ${validateCoupon.minOrderValue} to use this coupon`);
  }

  let discountAmount = 0;
  if (validateCoupon.discountType === "percentage") {
    discountAmount = (CartTotal * validateCoupon.discountValue) / 100;
    if (validateCoupon.maxDiscountAmount) {
      discountAmount = Math.min(discountAmount, validateCoupon.maxDiscountAmount);
    }
  } else if (validateCoupon.discountType === "fixed") {
    discountAmount = validateCoupon.discountValue;
    if (validateCoupon.maxDiscountAmount) {
      discountAmount = Math.min(discountAmount, validateCoupon.maxDiscountAmount);
    }
  }

  let totalAfterDiscount = CartTotal - discountAmount;
  if (totalAfterDiscount < 0) totalAfterDiscount = 0;

  // Lưu lại vào cart
  await cartModel.findOneAndUpdate(
    { orderBy: user._id },
    { totalAfterDiscount },
    { new: true }
  );

  res.json({ totalAfterDiscount, discountAmount });
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);

  if (!COD) {
    throw new Error("Create cash order failed");
  }

  try {
    const user = await User.findById(_id);
    const userCart = await cartModel.findOne({ orderBy: user._id });
    if (!userCart || !userCart.products || userCart.products.length === 0) {
      throw new Error("Cart is empty");
    }

    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.CartTotal;
    }

    // Tạo đơn hàng mới
    let newOrder = await new Order({
      products: userCart.products,
      paymentIntend: {
        id: uniqid(),
        method: "COD",
        created: Date.now(),
        currency: "vnd",
      },
      orderBy: user._id,
      orderStatus: "Cash on Delivery",
      totalAmount: finalAmount, // Đưa amount ra ngoài
    }).save();

    // Cập nhật số lượng tồn kho và đã bán cho từng sản phẩm
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      };
    });
    const Product = require("../models/productModel");
    await Product.bulkWrite(update, {});

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


const createAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { province, district, ward, street } = req.body;
  console.log(province, district, ward, street);
  validateMongoDbId(_id);
  try {
    const user = await User.findById(_id);
    user.address = { province, district, ward, street };
    await user.save();
    res.json(user.address);
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
  loginAdmin,
  updateUserAddress,
  userCoupon,
  createOrder,
  getOrder,
  updateOrderStatus,
  createAddress,
};
