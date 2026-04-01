/**
 * Global Error Handler Middleware
 * Catches all errors and sends consistent response
 */

const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ ERROR:', err);
  }

  // Convert non-ApiError errors
  if (!(error instanceof ApiError)) {
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => ({
        field: e.path,
        message: e.message,
      }));
      error = ApiError.badRequest('Validation failed', messages);
    }
    // Mongoose duplicate key error
    else if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      error = ApiError.conflict(`${field} '${value}' already exists`);
    }
    // Mongoose cast error (invalid ObjectId)
    else if (error.name === 'CastError') {
      error = ApiError.badRequest(`Invalid ${error.path}: ${error.value}`);
    }
    // JWT errors
    else if (error.name === 'JsonWebTokenError') {
      error = ApiError.unauthorized('Invalid token');
    }
    else if (error.name === 'TokenExpiredError') {
      error = ApiError.unauthorized('Token expired');
    }
    // Generic error
    else {
      error = new ApiError(
        error.statusCode || 500,
        error.message || 'Internal Server Error',
        error.errors || null
      );
    }
  }

  // Send error response
  const response = {
    success: false,
    message: error.message,
    statusCode: error.statusCode,
  };

  // Add errors array if exists
  if (error.errors) {
    response.errors = error.errors;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;