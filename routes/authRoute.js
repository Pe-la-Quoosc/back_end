const express= require('express');
const {
    createUser,
    loginUserCtrl,
    getallUser,
    getaUser,
    deleteUser,
    updateaUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logoutUser,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    userCart,
    getUserCart,
    loginAdmin,
    emptyCart,
    userCoupon,
    createOrder,
    getOrder,
    updateOrderStatus,
} = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router=express.Router();

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);

router.get("/cart", authMiddleware, getUserCart);
router.delete("/cart", authMiddleware, emptyCart);

router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.get("/all-users", getallUser);
router.get("/refresh",handleRefreshToken);
router.post("/logout",logoutUser);
router.get("/:id",authMiddleware,isAdmin,getaUser);
router.delete("/:id",deleteUser); 

router.put("/edit-user",authMiddleware,updateaUser);
router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser);

router.post("/cart", authMiddleware, userCart);
router.post("/cart/apply-coupon", authMiddleware, userCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.get("/order", authMiddleware, getOrder);
router.put("/order/update-order/:id", authMiddleware, isAdmin, updateOrderStatus);
module.exports=router;