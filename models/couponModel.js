const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['product', 'shipping'],
        required: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0,
    },
    maxDiscountAmount: {
        type: Number,
        default: null,
    },
    minOrderValue: {
        type: Number,
        default: 0,
    },
    expiry: {
        type: Date,
        required: true,
    },
    usageLimit: {
        type: Number,
        default: null, 
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

// couponSchema.index({ name: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
