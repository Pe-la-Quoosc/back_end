const mongoose = require('mongoose');

var cartSchema = new mongoose.Schema({
    product:[
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number,
            price: Number
        },
    ],
    CartTotal: Number,
    totalAfterDiscount: Number,
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

},{
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);