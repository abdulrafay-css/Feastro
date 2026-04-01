/**
 * User Routes
 * /api/users/*
 */

const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  getUserProfile,
  updateProfile,
  getUserRecipes,
  getLikedRecipes,
  getSavedRecipes,
  getCollections,
  deleteAccount,
} = require('../controllers/userController');

const router = express.Router();

/**
 * @route   GET /api/users/:username
 * @desc    Get user profile by username
 * @access  Public
 */
router.get(
  '/:username',
  [
    param('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 30 }).withMessage('Invalid username'),
    
    validate,
  ],
  getUserProfile
);

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put(
  '/profile',
  protect,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
    
    body('avatar')
      .optional()
      .isURL().withMessage('Avatar must be a valid URL'),
    
    body('coverImage')
      .optional()
      .isURL().withMessage('Cover image must be a valid URL'),
    
    body('instagram')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Instagram username too long'),
    
    body('youtube')
      .optional()
      .isURL().withMessage('YouTube link must be a valid URL'),
    
    body('website')
      .optional()
      .isURL().withMessage('Website must be a valid URL'),
    
    validate,
  ],
  updateProfile
);

/**
 * @route   GET /api/users/:username/recipes
 * @desc    Get user's recipes
 * @access  Public
 */
router.get(
  '/:username/recipes',
  [
    param('username')
      .trim()
      .notEmpty().withMessage('Username is required'),
    
    validate,
  ],
  getUserRecipes
);

/**
 * @route   GET /api/users/me/liked-recipes
 * @desc    Get current user's liked recipes
 * @access  Private
 */
router.get('/me/liked-recipes', protect, getLikedRecipes);

/**
 * @route   GET /api/users/me/saved-recipes
 * @desc    Get current user's saved recipes
 * @access  Private
 */
router.get('/me/saved-recipes', protect, getSavedRecipes);

/**
 * @route   GET /api/users/me/collections
 * @desc    Get user's saved recipe collections
 * @access  Private
 */
router.get('/me/collections', protect, getCollections);

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', protect, deleteAccount);

module.exports = router;