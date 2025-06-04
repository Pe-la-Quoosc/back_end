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
        typeof: String,
        default: 'Not Processed',
        enum: ['Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    },
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
},{
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
