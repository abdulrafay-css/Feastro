/**
 * Authentication Routes
 * /api/auth/*
 */

const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getCurrentUser,
  logout,
  saveOnboardingPreferences,
} = require('../controller/authController');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores')
      .toLowerCase(),
    
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    
    validate,
  ],
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    
    body('password')
      .notEmpty().withMessage('Password is required'),
    
    validate,
  ],
  login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', protect, getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', protect, logout);

/**
 * @route   PUT /api/auth/onboarding
 * @desc    Save onboarding preferences
 * @access  Private
 */
router.put(
  '/onboarding',
  protect,
  [
    body('dietaryRestrictions')
      .optional()
      .isArray().withMessage('Dietary restrictions must be an array'),
    
    body('cuisinePreferences')
      .optional()
      .isArray().withMessage('Cuisine preferences must be an array'),
    
    body('skillLevel')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid skill level'),
    
    body('cookingTime')
      .optional()
      .isIn(['any', 'quick', 'medium', 'long']).withMessage('Invalid cooking time preference'),
    
    validate,
  ],
  saveOnboardingPreferences
);

module.exports = router;