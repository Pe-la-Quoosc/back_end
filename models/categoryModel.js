const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  validVariants: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Category", categorySchema);
