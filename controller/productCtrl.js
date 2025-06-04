const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const qs = require("qs");
// Create product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//update product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findOneAndUpdate({_id: id}, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});
//delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: id });
    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});


//get a product
const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {

    

    const product = await Product.findById(id);
      res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {

  try {

    // Filtering
    const queryObj = qs.parse(req._parsedUrl.query)
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    console.log(queryObj);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));
    
    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("createdAt");
    }
    // Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    console.log(page, limit, skip);
    if (req.query.page) {
      const totalProducts = await Product.countDocuments();
      if (skip >= totalProducts) throw new Error("This page does not exist");
    }
    const product = await query;
    res.json(product);
  
  
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createProduct, updateProduct, getaProduct, getAllProducts, deleteProduct };
