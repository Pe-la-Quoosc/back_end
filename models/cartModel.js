const mongoose = require('mongoose');

var cartSchema = new mongoose.Schema({
     products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      selectedAttributes: {
        type: Map,
        of: String,
      },
      quantity: Number,
      price: Number,
    },
  ],
  orderBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
},{
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);