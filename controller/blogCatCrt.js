const Category = require('../models/BlogCatModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatedCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.json(deletedCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getcategory = await Category.findById(id);
        res.json(getcategory);
    } catch (error) {
        throw new Error(error);
    }
});

getAllCategories = asyncHandler(async (req, res) => {
    try {
        const getallcategories = await Category.find({});
        res.json(getallcategories);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategories
};

