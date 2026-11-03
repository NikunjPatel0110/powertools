const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/login', loginLimiter, loginAdmin);

module.exports = router;
