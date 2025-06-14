const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = await User.findById(decoded?.id);
        next();
      } else {
        throw new Error("Not authorized, no token");
      }
    } catch (error) {
      throw new Error("Not authorized, token failed");
    }
  } else {
    throw new Error("There is no token attached to the header");
  }
});



const isAdmin = asyncHandler(async (req, res, next) => {
//   console.log(req.user);
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if (adminUser.role !== "admin") {
        throw new Error("You are not an admin, access denied");
    } else {
        next();
    }
});

module.exports = { authMiddleware, isAdmin };
