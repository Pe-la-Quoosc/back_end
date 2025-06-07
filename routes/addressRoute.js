const express = require("express");
const router = express.Router();
const {
    getAllProvinces,
    getDistrictsByProvince,
    getWardsByDistrict
} = require("../controller/addressCrtl");

const { authMiddleware } = require("../middlewares/authMiddleware");

// Route to get all provinces
router.get("/provinces", authMiddleware, getAllProvinces);
// Route to get districts by province ID
router.get("/districts/:provinceId", authMiddleware, getDistrictsByProvince);
// Route to get wards by district ID
router.get("/wards/:districtId", authMiddleware, getWardsByDistrict);