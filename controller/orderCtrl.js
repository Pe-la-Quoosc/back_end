const User = require('../models/blogModel');
const slugify = require('slugify');
const { validate } = require('../models/productModel');
const Order = require('../models/orderModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

const getOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteOrders = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        res.json(deletedOrder);
    } catch (error) {
        throw new Error(error);
    }
});

const getOneOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const order = await Order.findById(id);
        res.json(order);
    } catch (error) {
        throw new Error(error);
    }
});




module.exports = {
    getOrders,
    deleteOrders,
    getOneOrder
};