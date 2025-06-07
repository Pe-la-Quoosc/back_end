const mongoose = require("mongoose");

const WardSchema = new mongoose.Schema({
  level3_id: String,
  name: String,
  type: String,
}, { _id: false });

const DistrictSchema = new mongoose.Schema({
  level2_id: String,
  name: String,
  type: String,
  level3s: [WardSchema],
}, { _id: false });

const ProvinceSchema = new mongoose.Schema({
  level1_id: String,
  name: String,
  type: String,
  level2s: [DistrictSchema],
});

module.exports = mongoose.model("Address", ProvinceSchema);