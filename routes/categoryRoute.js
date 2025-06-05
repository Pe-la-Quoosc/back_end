const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createCategory, getAllCategories, getCategoryById, deleteCategory, updateCategory } = require("../controller/categoryCtrl");

router.post("/",authMiddleware,isAdmin, createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
module.exports = router;