const express= require('express');
const {createUser, loginUserCtrl, getallUser, getaUser, deleteUser, updateaUser, blockUser, unblockUser, handleRefreshToken, logoutUser} = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router=express.Router();

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/all-users", getallUser);
router.get("/refresh",handleRefreshToken);
router.get("/logout",logoutUser);
router.get("/:id",authMiddleware,isAdmin,getaUser);
router.delete("/:id",deleteUser); 
router.put("/edit-user",authMiddleware,updateaUser);
router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser);

module.exports=router;