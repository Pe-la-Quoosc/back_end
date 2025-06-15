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
  CartTotal: Number,
  totalAfterDiscount: Number,
  orderCode: { 
        type: Number,
        unique: true,
        sparse: true 
    },
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);