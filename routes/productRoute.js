const express= require('express');
const router=express.Router();
const { createProduct, 
        getaProduct,
        getAllProducts,
        updateProduct,
        deleteProduct,
        rating,
} = require('../controller/productCtrl');
const { isAdmin,authMiddleware } = require('../middlewares/authMiddleware');


router.post('/', createProduct);
router.get('/:id', getaProduct);
router.put("/rating", authMiddleware, rating);
router.put('/:id', updateProduct);
router.get('/', getAllProducts);
router.delete('/:id',authMiddleware,isAdmin, deleteProduct);

module.exports = router;