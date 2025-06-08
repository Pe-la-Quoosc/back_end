 const express = require('express');
const router = express.Router();
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, getCoupon } = require("../controller/couponCrtl");
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, isAdmin, createCoupon);
router.get('/', authMiddleware, getAllCoupons);
router.put('/:id', authMiddleware, isAdmin, updateCoupon);
router.delete('/:id', authMiddleware, isAdmin, deleteCoupon);
router.get('/:id', authMiddleware, isAdmin, getCoupon);

module.exports = router;
