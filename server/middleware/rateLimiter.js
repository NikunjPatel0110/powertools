const { rateLimit } = require('express-rate-limit');

// General limiter: 100 requests per 15 minutes on /api
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
});

// Login limiter: max 5 attempts per 15 minutes per IP on POST /api/auth/login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again after 15 minutes' },
});

// Enquiry limiter: 5 per hour on POST /api/enquiries to stop spam
const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many enquiries submitted, please try again after an hour' },
});

module.exports = {
  apiLimiter,
  loginLimiter,
  enquiryLimiter,
};

