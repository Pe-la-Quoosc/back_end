const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");

const createCategory = asyncHandler(async (req, res) => {
  const { name, attributes } = req.body;
  // console.log("Request body:", req.body);
  try {
    const category = await Category.create({ name, attributes });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getCategoryAttributes = asyncHandler(async (req, res) => {
  const { categoryId } = req.params; // Lấy categoryId từ URL
  try {
    const category = await Category.findById(categoryId).select("attributes");
    if (!category) {
      throw new Error("Category not found");
    }
    res.json(category.attributes); // Trả về danh sách attributes
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to fetch attributes" });
  }
});

const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//delete category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    res.status(200).json(deletedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//get a category by id
const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, validVariants } = req.body;
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, validVariants },
      { new: true }
    );
    res.json(updatedCategory);
  } catch (error) {
      throw new Error(error);
  }
});

module.exports = { createCategory,getCategoryAttributes, getAllCategories, deleteCategory, getCategoryById, updateCategory };