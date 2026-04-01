/**
 * Validation Middleware
 * Express-validator wrapper for request validation
 */

const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Validate request and return errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    throw ApiError.badRequest('Validation failed', errorMessages);
  }

  next();
};

module.exports = validate;