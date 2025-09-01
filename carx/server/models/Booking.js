const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    date: { type: Date, required: true }
});

module.exports = mongoose.model('Booking', BookingSchema);
