const  Exercise  = require('../models/exerciseModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');
// Lấy tất cả bài tập
const getAllExercises = asyncHandler(async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (error) {
        throw new Error(error);
  }
});

// Tạo mới một bài tập
const createExercise = asyncHandler(async (req, res) => {
  const { name, muscle_group, description, equipment, step, img, video } = req.body;

  const newExercise = new Exercise({
    name,
    muscle_group,
    description,
    equipment,
    step,
    img,
    video
  });

  try {
    const savedExercise = await newExercise.save();
    res.status(201).json(savedExercise);
  } catch (error) {
        throw new Error(error);
  }
});

module.exports = {
  getAllExercises,
  createExercise
};