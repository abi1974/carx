const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    model: String,
    company: String,
    year: Number,
    price: Number,
    features: [String]
});

module.exports = mongoose.model('Car', CarSchema);
