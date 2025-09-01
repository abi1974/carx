const express = require('express');
const router = express.Router();

// @route GET /cars
router.get('/', (req, res) => {
    res.json({ message: 'Get all cars' });
});

// @route POST /cars
router.post('/', (req, res) => {
    res.json({ message: 'Add a new car' });
});

module.exports = router;
