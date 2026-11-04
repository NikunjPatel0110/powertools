const express = require('express');
const router = express.Router();
const { getEnquiries, createEnquiry, deleteEnquiry } = require('../controllers/enquiryController');
const { protect } = require('../middleware/auth');
const { enquiryLimiter } = require('../middleware/rateLimiter');
const { validateEnquiry } = require('../middleware/validators');

router.route('/')
  .get(protect, getEnquiries)
  .post(enquiryLimiter, validateEnquiry, createEnquiry);

router.delete('/:id', protect, deleteEnquiry);
//---------------
module.exports = router;
