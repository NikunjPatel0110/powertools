const express = require('express');
const router = express.Router();
const { getEnquiries, createEnquiry } = require('../controllers/enquiryController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getEnquiries).post(createEnquiry);

module.exports = router;
