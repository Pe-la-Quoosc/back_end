const jwt= require("jsonwebtoken");

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d", // Refresh token valid for 3 days
  });
}

module.exports = { generateRefreshToken };