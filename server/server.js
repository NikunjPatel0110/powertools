const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const sanitizeInput = require('./middleware/sanitize');

dotenv.config();

// Ensure JWT_SECRET is configured from env and meets min length of 32
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim().length < 32) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is missing or less than 32 characters long.');
  process.exit(1);
}

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const enquiryRoutes = require('./routes/enquiries');
const uploadRoutes = require('./routes/upload');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Trust reverse proxies (Vercel, Render, Nginx, etc.)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'https://powertools-nine.vercel.app',
  'https://akmt.in',
  'https://www.akmt.in',
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (curl, uptime monitors, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Body parser with 10kb limit
app.use(express.json({ limit: '10kb' }));

// Sanitize MongoDB operators ($ and .)
app.use(sanitizeInput);

// General rate limiter on all /api routes
app.use('/api', apiLimiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/upload', uploadRoutes);

// Catch 404 and forward to error handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
