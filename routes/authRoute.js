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
// Sent link to reset password
router.post("/forgot-password", forgotPasswordToken);
// Reset password using token
router.patch("/reset-password/:token", resetPassword);




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
//Update user address
router.patch("/update-address", updateUserAddress);
//Change password
router.patch("/change-password",authMiddleware,changePassword);

router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser);


router.put("/cart/apply-coupon", authMiddleware, userCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);

router.put("/order/update-order/:id", authMiddleware, isAdmin, updateOrderStatus);
router.put("/address", authMiddleware, createAddress);

router.post('/payment/create', authMiddleware,createPayment);
router.post('/webhook', webhookHandler); // For handling webhooks
router.post('/process-orders', processWebhookOrders); // For processing webhook orders
router.get("/order", authMiddleware, getOrder);
router.put("/order/update-order/:id", authMiddleware, isAdmin, updateOrderStatus);

module.exports=router;