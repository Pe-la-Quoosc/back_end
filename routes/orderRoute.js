const express = require('express');
const router = express.Router();
const {
    getOrders,
    deleteOrders,
    getOneOrder,
} = require('../controller/orderCtrl');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');

router.get('/',  getOrders);
router.delete('/:id', authMiddleware, isAdmin, deleteOrders);
router.get('/:id', authMiddleware, isAdmin, getOneOrder);

module.exports = router;

