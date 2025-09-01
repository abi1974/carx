const express = require('express');
const router = express.Router();

// @route GET /reviews
router.get('/', (req, res) => {
    res.json({ message: 'Get all reviews' });
});

// @route POST /reviews
router.post('/', (req, res) => {
    res.json({ message: 'Add a new review' });
});

module.exports = router;
