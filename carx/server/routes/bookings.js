const express = require('express');
const router = express.Router();

// @route GET /bookings
router.get('/', (req, res) => {
    res.json({ message: 'Get all bookings' });
});

// @route POST /bookings
router.post('/', (req, res) => {
    res.json({ message: 'Create a new booking' });
});

module.exports = router;
