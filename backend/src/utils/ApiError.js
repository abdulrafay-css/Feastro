/**
 * Custom API Error Class
 * Standardized error handling
 */

class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
  
  // Common error types
  static badRequest(message = 'Bad Request', errors = null) {
    return new ApiError(400, message, errors);
  }
  
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }
  
  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }
  
  static notFound(message = 'Not Found') {
    return new ApiError(404, message);
  }
  
  static conflict(message = 'Conflict') {
    return new ApiError(409, message);
  }
  
  static internal(message = 'Internal Server Error') {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;