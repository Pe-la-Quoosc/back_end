const express= require('express');
const {
    createUser,
    loginUserCtrl,
    getallUser,
    getaUser,
    deleteUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logoutUser,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    updateUserAddress,
    userCoupon,
    createOrder,
    getOrder,
    updateOrderStatus,
    createAddress,
    getCurrentUser,
    updateCurrentUser,
    createPayment,
    webhookHandler,
    processWebhookOrders,
} = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router=express.Router();

router.post("/register", createUser);
router.post("/forgot-password", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.get("/order", authMiddleware, getOrder);
router.put("/password", authMiddleware, updatePassword);

router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.get("/all-users", getallUser);
router.get("/refresh",handleRefreshToken);
router.post("/logout",logoutUser);
//Get current user
router.get("/me", authMiddleware, getCurrentUser);
//Update current user
router.patch("/update-me",authMiddleware,updateCurrentUser);
router.get("/:id",authMiddleware,isAdmin,getaUser);
router.delete("/:id",deleteUser); 





router.put("/update-address", authMiddleware, updateUserAddress);
router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser);


router.post("/cart/apply-coupon", authMiddleware, userCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);

router.put("/order/update-order/:id", authMiddleware, isAdmin, updateOrderStatus);
router.put("/address", authMiddleware, createAddress);

router.post('/payment/create', authMiddleware,createPayment);
router.post('/webhook', webhookHandler); // For handling webhooks
router.post('/process-orders', processWebhookOrders); // For processing webhook orders
router.get("/order", authMiddleware, getOrder);
router.put("/order/update-order/:id", authMiddleware, isAdmin, updateOrderStatus);

module.exports=router;