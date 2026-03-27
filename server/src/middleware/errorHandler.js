// Centralized Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    data: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
};

module.exports = errorHandler;
