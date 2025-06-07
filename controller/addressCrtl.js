const { model } = require("mongoose");
const Address = require("../models/addressModel");
const asyncHandler = require("express-async-handler");

// Get all provinces
const getAllProvinces = asyncHandler(async (req, res) => {
    try {
        const provinces = await Address.find({}, { level1_id: 1, name: 1, type: 1});
        res.json(provinces);
        } catch (error) {
        throw new Error(error);
    }
});

const getDistrictsByProvince = asyncHandler(async (req, res) => {
    const { provinceId } = req.params;
    try {
        const districts = await Address.findOne(
            { level1_id: provinceId },
            { level2s: 1 }
        );
        res.json(districts.level2s);
    } catch (error) {
        throw new Error(error);
    }
});

const getWardsByDistrict = asyncHandler(async (req, res) => {
    const { districtId } = req.params;
    try {
        const wards = await Address.findOne(
            { "level2s.level2_id": districtId },
            { "level2s.$": 1 }
        );
        res.json(wards.level2s[0].level3s);
    } catch (error) {
        throw new Error(error);
    }
});

model.exports = {
    getAllProvinces,
    getDistrictsByProvince,
    getWardsByDistrict
};