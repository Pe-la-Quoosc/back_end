const asyncHandler = require("express-async-handler");
const Address = require("../models/addressModel");

const getAddressList = asyncHandler(async (req, res) => {
  try {
    const addresses = await Address.findOne(); // Lấy dữ liệu từ MongoDB
    res.json(addresses); // Trả về dữ liệu
  } catch (error) {
    console.error("Error fetching addresses:", error); // Kiểm tra lỗi
    res.status(500).json({ message: error.message || "Failed to fetch addresses" });
  }
});

module.exports = { getAddressList };