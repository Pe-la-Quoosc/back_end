const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const slugify = require("slugify");
const qs = require("qs");
// Create product
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, images, quantity, discountPercentage } = req.body;

  try {
    // Kiểm tra danh mục có tồn tại không
    const categoryData = await Category.findById(category);
    if (!categoryData) {
      return res.status(400).json({ message: "Invalid category" });
    }

     // Tính tổng quantity từ variants

    // Tạo slug từ tiêu đề sản phẩm
    const slug = slugify(title, { lower: true });

    // Tạo sản phẩm mới
    const newProduct = await Product.create({
      title,
      slug,
      description,
      price,
      category,
      quantity: quantity || 0, // Sử dụng giá trị quantity từ body hoặc mặc định là 0
      discountPercentage: discountPercentage || 0, // Sử dụng giá trị discountPercentage từ body hoặc mặc định là 0
      images,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

  // try {

  //   // Filtering
  //   const queryObj = qs.parse(req._parsedUrl.query)
  //   const excludedFields = ["page", "sort", "limit", "fields"];
  //   excludedFields.forEach((el) => delete queryObj[el]);
  //   console.log(queryObj);

  //   let queryStr = JSON.stringify(queryObj);
  //   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  //   let query = Product.find(JSON.parse(queryStr));
    
  //   // Sorting
  //   if (req.query.sort) {
  //     const sortBy = req.query.sort.split(",").join(" ");
  //     query = query.sort(sortBy);
  //   } else {
  //     query = query.sort("createdAt");
  //   }
  //   // Pagination
  //   const page = req.query.page;
  //   const limit = req.query.limit;
  //   const skip = (page - 1) * limit;
  //   query = query.skip(skip).limit(limit);
  //   console.log(page, limit, skip);
  //   if (req.query.page) {
  //     const totalProducts = await Product.countDocuments();
  //     if (skip >= totalProducts) throw new Error("This page does not exist");
  //   }
  //   const product = await query;
  //   res.json(product);
  
    try {
    const products = await Product.find()
      .populate("category", "name")
      .exec();

    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const {_id}= req.user;
  const {star,prodID, comment}= req.body;
  try {
     const product = await Product.findById(prodID);
  let alreadyRated = product.ratings.find(
    (userId) => userId.postedBy.toString() === _id.toString()
  );
  if (alreadyRated) {
    const updateRating = await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRated },
      },
      {
        $set: { "ratings.$.star": star, "ratings.$.comment": comment },
      },
      { new: true }
    );
  } else{
    const rateProduct= await Product.findByIdAndUpdate(
      prodID,
      {
        $push: { 
          ratings: { 
            star: star,
            comment: comment,
            postedBy: _id,
          } 
        },
      },
      { new: true }
    );
  }
  const getAllRatings = await Product.findById(prodID);
  let totalRating = getAllRatings.ratings.length;
  let ratingSum = getAllRatings.ratings
    .map((item) => item.star)
    .reduce((prev, curr) => prev + curr, 0);
  let actualRating = Math.round(ratingSum / totalRating);
  let finalproduct = await Product.findByIdAndUpdate(
    prodID,
    {
      totalrating: actualRating,
    },
    { new: true }
  );
  res.json(finalproduct);  
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createProduct,
                  updateProduct,
                  getaProduct,
                  getAllProducts,
                  deleteProduct,
                  rating };
