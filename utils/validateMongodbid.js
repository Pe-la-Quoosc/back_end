const mongoose = require('mongoose');

const validateMongoDbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new Error(`MongoDB ID is not valid: ${id}`);
  }
  return isValid;
}

module.exports = validateMongoDbId;
