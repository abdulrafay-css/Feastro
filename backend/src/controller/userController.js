/**
 * User Controller
 * Handles user profile operations
 */

const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Like = require('../models/Like');
const SavedRecipe = require('../models/SavedRecipe');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @route   GET /api/users/:username
 * @desc    Get user profile by username
 * @access  Public
 */
const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const userProfile = user.getPublicProfile();

    res.json(
      ApiResponse.success(userProfile, 'User profile retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ['name', 'bio', 'avatar', 'coverImage', 'socialLinks'];
    const updates = {};

    // Filter allowed updates
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Handle nested socialLinks
    if (req.body.instagram || req.body.youtube || req.body.website) {
      updates.socialLinks = {
        instagram: req.body.instagram || req.user.socialLinks?.instagram,
        youtube: req.body.youtube || req.user.socialLinks?.youtube,
        website: req.body.website || req.user.socialLinks?.website,
      };
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    const userProfile = user.getPublicProfile();

    res.json(
      ApiResponse.success(userProfile, 'Profile updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/:username/recipes
 * @desc    Get user's recipes
 * @access  Public
 */
const getUserRecipes = async (req, res, next) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Find user
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    // Get recipes
    const recipes = await Recipe.find({
      creator: user._id,
      isPublished: true,
      deletedAt: null,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('creator', 'name username avatar verified');

    const total = await Recipe.countDocuments({
      creator: user._id,
      isPublished: true,
      deletedAt: null,
    });

    res.json(
      ApiResponse.success({
        recipes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/me/liked-recipes
 * @desc    Get current user's liked recipes
 * @access  Private
 */
const getLikedRecipes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Find liked recipe IDs
    const likes = await Like.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('recipe');

    const recipeIds = likes.map(like => like.recipe);

    // Get recipes
    const recipes = await Recipe.find({
      _id: { $in: recipeIds },
      isPublished: true,
      deletedAt: null,
    })
      .populate('creator', 'name username avatar verified');

    // Add is_liked flag
    const recipesWithFlags = recipes.map(recipe => ({
      ...recipe.toObject(),
      is_liked: true,
    }));

    const total = await Like.countDocuments({ user: req.user._id });

    res.json(
      ApiResponse.success({
        recipes: recipesWithFlags,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/me/saved-recipes
 * @desc    Get current user's saved recipes
 * @access  Private
 */
const getSavedRecipes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const collection = req.query.collection;

    // Build query
    const query = { user: req.user._id };
    if (collection) {
      query.collection = collection;
    }

    // Find saved recipes
    const savedRecipes = await SavedRecipe.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'recipe',
        match: { isPublished: true, deletedAt: null },
        populate: {
          path: 'creator',
          select: 'name username avatar verified',
        },
      });

    // Filter out null recipes (deleted or unpublished)
    const recipes = savedRecipes
      .filter(sr => sr.recipe)
      .map(sr => ({
        ...sr.recipe.toObject(),
        is_saved: true,
        collection: sr.collection,
        notes: sr.notes,
      }));

    const total = await SavedRecipe.countDocuments(query);

    res.json(
      ApiResponse.success({
        recipes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/me/collections
 * @desc    Get user's saved recipe collections
 * @access  Private
 */
const getCollections = async (req, res, next) => {
  try {
    // Aggregate collections with counts
    const collections = await SavedRecipe.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$collection',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const formattedCollections = collections.map(col => ({
      name: col._id,
      recipeCount: col.count,
    }));

    res.json(
      ApiResponse.success(formattedCollections)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/users/account
 * @desc    Soft delete user account
 * @access  Private
 */
const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Soft delete
    user.isActive = false;
    user.deletedAt = new Date();
    await user.save();

    res.json(
      ApiResponse.success(null, 'Account deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  getUserRecipes,
  getLikedRecipes,
  getSavedRecipes,
  getCollections,
  deleteAccount,
};