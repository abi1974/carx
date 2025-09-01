const express = require('express');
const router = express.Router();

// @route POST /auth/login
router.post('/login', (req, res) => {
    res.json({ message: 'User login' });
});

// @route POST /auth/signup
router.post('/signup', (req, res) => {
    res.json({ message: 'User signup' });
});

module.exports = router;
