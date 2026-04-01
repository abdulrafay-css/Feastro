/**
 * Authentication Middleware
 * JWT token verification and user authentication
 */

const { verifyToken } = require('../config/jwt');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Protect routes - require authentication
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      throw ApiError.unauthorized('Please login to access this resource');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw ApiError.unauthorized('User no longer exists');
    }

    // Check if user is active
    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.message === 'Invalid or expired token') {
      next(ApiError.unauthorized('Invalid or expired token'));
    } else {
      next(error);
    }
  }
};

/**
 * Optional authentication - doesn't fail if no token
 * Used for routes that work with/without auth (e.g., public feed)
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Silently continue without auth
    next();
  }
};

/**
 * Restrict to creator accounts only
 */
const restrictToCreator = (req, res, next) => {
  if (!req.user.isCreator) {
    return next(ApiError.forbidden('This action is only available to creator accounts'));
  }
  next();
};

/**
 * Restrict to verified accounts only
 */
const restrictToVerified = (req, res, next) => {
  if (!req.user.verified) {
    return next(ApiError.forbidden('This action requires a verified account'));
  }
  next();
};

/**
 * Check if user owns the resource
 */
const checkOwnership = (resourceModel) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const resource = await resourceModel.findById(resourceId);

      if (!resource) {
        throw ApiError.notFound('Resource not found');
      }

      // Check if user is the creator/owner
      const ownerId = resource.creator || resource.user;
      if (ownerId.toString() !== req.user._id.toString()) {
        throw ApiError.forbidden('You do not have permission to modify this resource');
      }

      // Attach resource to request for reuse in controller
      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  protect,
  optionalAuth,
  restrictToCreator,
  restrictToVerified,
  checkOwnership,
};