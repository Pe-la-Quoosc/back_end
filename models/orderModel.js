const mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
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
    paymentIntend: {},
    orderStatus: {
        type: String,
        default: 'Not Processed',
        enum: ['Not Processed', 'Processing', 'Cash on Delivery', 'Shipped', 'Delivered', 'Cancelled'],
    },
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
},{
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
