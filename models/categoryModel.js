const mongoose = require("mongoose");



const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  attributes: [
    {
      name: String,               // Ví dụ: "Size", "Color", "Material"
      values: [String],           // Ví dụ: ["S", "M", "L"], ["Đỏ", "Xanh"]
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model("Category", categorySchema);
