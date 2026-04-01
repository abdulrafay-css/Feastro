/**
 * Recipe Routes
 * /api/recipes/*
 */

const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, optionalAuth, restrictToCreator, checkOwnership } = require('../middleware/auth');
const Recipe = require('../models/Recipe');
const {
  createRecipe,
  getRecipes,
  getTrendingRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  unlikeRecipe,
  saveRecipe,
  unsaveRecipe,
} = require('../controllers/recipeController');

const router = express.Router();

/**
 * @route   POST /api/recipes
 * @desc    Create new recipe
 * @access  Private (Creator)
 */
router.post(
  '/',
  protect,
  restrictToCreator,
  [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    
    body('videoUrl')
      .notEmpty().withMessage('Video URL is required')
      .isURL().withMessage('Video URL must be valid'),
    
    body('thumbnail')
      .optional()
      .isURL().withMessage('Thumbnail must be a valid URL'),
    
    body('cookingTime')
      .optional()
      .isInt({ min: 1, max: 1440 }).withMessage('Cooking time must be 1-1440 minutes'),
    
    body('servings')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Servings must be 1-100'),
    
    body('difficulty')
      .optional()
      .isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
    
    body('ingredients')
      .optional()
      .isArray().withMessage('Ingredients must be an array'),
    
    body('instructions')
      .optional()
      .isArray().withMessage('Instructions must be an array'),
    
    body('category')
      .optional()
      .isIn(['budget', 'quick', 'spicy', 'healthy', 'comfort', 'protein', 'late-night', 'breakfast', 'vegetarian'])
      .withMessage('Invalid category'),
    
    body('cuisine')
      .optional()
      .isIn(['italian', 'chinese', 'mexican', 'indian', 'japanese', 'thai', 'french', 'american', 'middle-eastern', 'korean', 'pakistani', 'fusion'])
      .withMessage('Invalid cuisine'),
    
    body('dietary')
      .optional()
      .isArray().withMessage('Dietary must be an array'),
    
    body('tags')
      .optional()
      .isArray().withMessage('Tags must be an array'),
    
    validate,
  ],
  createRecipe
);

/**
 * @route   GET /api/recipes
 * @desc    Get all recipes (feed)
 * @access  Public
 */
router.get('/', optionalAuth, getRecipes);

/**
 * @route   GET /api/recipes/trending
 * @desc    Get trending recipes
 * @access  Public
 */
router.get('/trending', optionalAuth, getTrendingRecipes);

/**
 * @route   GET /api/recipes/:id
 * @desc    Get single recipe
 * @access  Public
 */
router.get(
  '/:id',
  optionalAuth,
  [
    param('id')
      .isMongoId().withMessage('Invalid recipe ID'),
    
    validate,
  ],
  getRecipeById
);

/**
 * @route   PUT /api/recipes/:id
 * @desc    Update recipe
 * @access  Private (Owner)
 */
router.put(
  '/:id',
  protect,
  checkOwnership(Recipe),
  [
    param('id')
      .isMongoId().withMessage('Invalid recipe ID'),
    
    body('title')
      .optional()
      .trim()
      .isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    
    body('thumbnail')
      .optional()
      .isURL().withMessage('Thumbnail must be a valid URL'),
    
    body('cookingTime')
      .optional()
      .isInt({ min: 1, max: 1440 }).withMessage('Cooking time must be 1-1440 minutes'),
    
    body('servings')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Servings must be 1-100'),
    
    body('difficulty')
      .optional()
      .isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
    
    body('category')
      .optional()
      .isIn(['budget', 'quick', 'spicy', 'healthy', 'comfort', 'protein', 'late-night', 'breakfast', 'vegetarian'])
      .withMessage('Invalid category'),
    
    validate,
  ],
  updateRecipe
);

/**
 * @route   DELETE /api/recipes/:id
 * @desc    Delete recipe
 * @access  Private (Owner)
 */
router.delete(
  '/:id',
  protect,
  checkOwnership(Recipe),
  [
    param('id')
      .isMongoId().withMessage('Invalid recipe ID'),
    
    validate,
  ],
  deleteRecipe
);

/**
 * @route   POST /api/recipes/:id/like
 * @desc    Like a recipe
 * @access  Private
 */
router.post(
  '/:id/like',
  protect,
  [
    param('id')
      .isMongoId().withMessage('Invalid recipe ID'),
    
    validate,
  ],
  likeRecipe
);

/**
 * @route   DELETE /api/recipes/:id/like
 * @desc    Unlike a recipe
 * @access  Private
 */
router.delete(
  '/:id/like',
  protect,
  [
    param('id')
      .isMongoId().withMessage('Invalid recipe ID'),
    
    validate,
  ],
  unlikeRecipe
);

/**
 * @route   POST /api/recipes/:id/save
 * @desc    Save a recipe
 * @access  Private
 */
router.post(
  '/:id/save',
  protect,
  [
    param('id')
      .isMongoId().withMessage('Invalid recipe ID'),
    
    body('collection')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Collection name too long'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Notes too long'),
    
    validate,
  ],
  saveRecipe
);

/**
 * @route   DELETE /api/recipes/:id/save
 * @desc    Unsave a recipe
 * @access  Private
 */
router.delete(
  '/:id/save',
  protect,
  [
    param('id')
      .isMongoId().withMessage('Invalid recipe ID'),
    
    validate,
  ],
  unsaveRecipe
);

module.exports = router;