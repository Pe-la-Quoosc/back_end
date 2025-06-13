const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  muscle_group: {
    type: String,
    required: true,
    enum: [
      'Ngực',
      'Lưng',
      'Vai',
      'Tay',
      'Chân',
      'Bụng',
    ]
  },
  description: {
    type: String,
    required: true,
  },
  equipment: {
    type: String,
    required: true,
  },
  step: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  img: {
    type: String,
    required: false,
  },
  video: {
    type: String,
    required: false,
  }
});

module.exports = mongoose.model('Exercise', exerciseSchema, 'exercise');
