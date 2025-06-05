const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createCategory, getAllCategories, getCategoryById, deleteCategory } = require("../controller/categoryCtrl");

router.post("/",authMiddleware,isAdmin, createCategory);
router.get("/", getAllCategories);
router.get("/:id",authMiddleware,isAdmin, getCategoryById);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);
module.exports = router;