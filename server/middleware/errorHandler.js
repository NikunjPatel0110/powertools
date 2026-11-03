const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
};

const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Log error details on server for debugging/auditing
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // Body parser 10kb limit exceeded
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Payload too large. Maximum size allowed is 10kb.' });
  }

  // JSON syntax errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }

  // Multer upload errors
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }

  // Mongoose invalid ObjectId CastError
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid identifier format' });
  }

  // Mongoose Schema validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Mongo duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ message: `A record with this ${field} already exists` });
  }

  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'Not allowed by CORS' });
  }

  const statusCode = (res.statusCode && res.statusCode !== 200) ? res.statusCode : (err.status || err.statusCode || 500);

  // In production, never leak internal error messages or stack traces
  const responseMessage = isProduction
    ? (statusCode >= 500 ? 'Internal server error' : (err.message || 'Error occurred'))
    : (err.message || 'Internal server error');

  res.status(statusCode).json({
    message: responseMessage,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};

