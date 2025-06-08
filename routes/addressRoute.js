const express = require("express");

const { getAddressList } = require("../controller/addressCtrl");

const router = express.Router();

router.get("/all-address", getAddressList); // Route lấy danh sách địa chỉ

module.exports = router;

