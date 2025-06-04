const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { send } = require("process");
const { sendEmail } = require("./emailCtrl");
//Create user
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    await newUser.save();
    res.json(newUser);
  } else {
    throw new Error("User already exists");
  }
});
//Login user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
  const findUser = await User.findOne({ email });
//   console.log("User found:", findUser);
  // console.log(await findUser.isPasswordMatched(password));
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
      firstname: findUser?.firstname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id), // Assuming generateToken is imported from jwtToken.js
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
        firstname: req?.body?.firstname,
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
  if(!cookie?.refreshToken) {
    throw new Error("No refresh token in cookies");
  }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if(!user) {
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
const updatePassword = asyncHandler(async(req, res) => {
  const {_id} = req.user;
  const {password} = req.body;
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
  try{
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
  }catch (error) {
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
};
