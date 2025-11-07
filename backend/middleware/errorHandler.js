const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);
  
    // Default error response
    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';

    // Handle API Rate Limiting (429)
    if (err.status === 429 || (err.message && err.message.includes('429'))) {
      status = 429;
      message = 'The AI service is currently busy due to high demand. Please try again in a few moments.';
    }
  
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      status = 400;
      message = Object.values(err.errors)
        .map(e => e.message)
        .join(', ');
    }
  
    // Mongoose cast error
    if (err.name === 'CastError') {
      status = 400;
      message = 'Invalid ID format';
    }
  
    // MongoDB duplicate key error
    if (err.code === 11000) {
      status = 409;
      message = `${Object.keys(err.keyPattern)[0]} already exists`;
    }
  
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      status = 401;
      message = 'Invalid token';
    }
  
    if (err.name === 'TokenExpiredError') {
      status = 401;
      message = 'Token expired';
    }
  
    res.status(status).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };
  
  module.exports = errorHandler;