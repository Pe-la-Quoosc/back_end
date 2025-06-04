const mongoose = require('mongoose');

var blogCatSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        index: true,
        required: true,
    },
}, {
    timestamps: true,
}
);

module.exports = mongoose.model('BlogCategory', blogCatSchema);