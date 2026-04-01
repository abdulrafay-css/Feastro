/**
 * Recipe Controller
 * Handles recipe CRUD and engagement operations
 */

const Recipe = require('../models/Recipe');
const Like = require('../models/Like');
const SavedRecipe = require('../models/SavedRecipe');
const User = require('../models/User');
const { deleteFromS3 } = require('../config/aws');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @route   POST /api/recipes
 * @desc    Create new recipe
 * @access  Private (Creator)
 */
const createRecipe = async (req, res, next) => {
  try {
    const {
      title,
      description,
      videoUrl,
      thumbnail,
      cookingTime,
      servings,
      difficulty,
      ingredients,
      instructions,
      category,
      cuisine,
      dietary,
      tags,
      tips,
    } = req.body;

    // Create recipe
    const recipe = await Recipe.create({
      creator: req.user._id,
      title,
      description,
      videoUrl,
      thumbnail,
      cookingTime,
      servings,
      difficulty,
      ingredients,
      instructions,
      category,
      cuisine,
      dietary,
      tags,
      tips,
    });

    // Update user's recipe count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.recipesCount': 1 },
    });

    // Populate creator
    await recipe.populate('creator', 'name username avatar verified');

    res.status(201).json(
      ApiResponse.created(recipe, 'Recipe created successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/recipes
 * @desc    Get all recipes (feed)
 * @access  Public
 */
const getRecipes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query
    const query = {
      isPublished: true,
      deletedAt: null,
    };

    // Filters
    if (req.query.category) query.category = req.query.category;
    if (req.query.cuisine) query.cuisine = req.query.cuisine;
    if (req.query.difficulty) query.difficulty = req.query.difficulty;
    if (req.query.dietary) query.dietary = { $in: req.query.dietary.split(',') };

    // Cooking time filter
    if (req.query.maxCookingTime) {
      query.cookingTime = { $lte: parseInt(req.query.maxCookingTime) };
    }

    // Search by title
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Get recipes
    const recipes = await Recipe.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('creator', 'name username avatar verified');

    // If user is authenticated, add is_liked and is_saved flags
    if (req.user) {
      const recipeIds = recipes.map(r => r._id);

      const [likes, saves] = await Promise.all([
        Like.find({ user: req.user._id, recipe: { $in: recipeIds } }).select('recipe'),
        SavedRecipe.find({ user: req.user._id, recipe: { $in: recipeIds } }).select('recipe'),
      ]);

      const likedIds = new Set(likes.map(l => l.recipe.toString()));
      const savedIds = new Set(saves.map(s => s.recipe.toString()));

      const recipesWithFlags = recipes.map(recipe => ({
        ...recipe.toObject(),
        is_liked: likedIds.has(recipe._id.toString()),
        is_saved: savedIds.has(recipe._id.toString()),
      }));

      const total = await Recipe.countDocuments(query);

      return res.json(
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
    }

    const total = await Recipe.countDocuments(query);

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
 * @route   GET /api/recipes/trending
 * @desc    Get trending recipes
 * @access  Public
 */
const getTrendingRecipes = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const recipes = await Recipe.findTrending(limit);

    res.json(
      ApiResponse.success(recipes, 'Trending recipes retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/recipes/:id
 * @desc    Get single recipe by ID
 * @access  Public
 */
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('creator', 'name username avatar verified');

    if (!recipe || recipe.deletedAt) {
      throw ApiError.notFound('Recipe not found');
    }

    // Increment views
    await recipe.incrementViews();

    // Add flags if user authenticated
    let recipeData = recipe.toObject();
    if (req.user) {
      const [isLiked, isSaved] = await Promise.all([
        Like.exists({ user: req.user._id, recipe: recipe._id }),
        SavedRecipe.exists({ user: req.user._id, recipe: recipe._id }),
      ]);

      recipeData.is_liked = !!isLiked;
      recipeData.is_saved = !!isSaved;
    }

    res.json(
      ApiResponse.success(recipeData, 'Recipe retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/recipes/:id
 * @desc    Update recipe
 * @access  Private (Owner)
 */
const updateRecipe = async (req, res, next) => {
  try {
    const allowedUpdates = [
      'title', 'description', 'thumbnail', 'cookingTime', 'servings',
      'difficulty', 'ingredients', 'instructions', 'category', 'cuisine',
      'dietary', 'tags', 'tips', 'isPublished',
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('creator', 'name username avatar verified');

    if (!recipe) {
      throw ApiError.notFound('Recipe not found');
    }

    res.json(
      ApiResponse.success(recipe, 'Recipe updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/recipes/:id
 * @desc    Delete recipe (soft delete)
 * @access  Private (Owner)
 */
const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      throw ApiError.notFound('Recipe not found');
    }

    // Soft delete
    recipe.deletedAt = new Date();
    await recipe.save();

    // Update user's recipe count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.recipesCount': -1 },
    });

    // Optional: Delete from S3 (uncomment if needed)
    // await deleteFromS3(recipe.videoUrl);
    // if (recipe.thumbnail) await deleteFromS3(recipe.thumbnail);

    res.json(
      ApiResponse.success(null, 'Recipe deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/recipes/:id/like
 * @desc    Like a recipe
 * @access  Private
 */
const likeRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe || recipe.deletedAt) {
      throw ApiError.notFound('Recipe not found');
    }

    // Check if already liked
    const existingLike = await Like.findOne({
      user: req.user._id,
      recipe: recipeId,
    });

    if (existingLike) {
      throw ApiError.conflict('Recipe already liked');
    }

    // Create like
    await Like.create({
      user: req.user._id,
      recipe: recipeId,
    });

    // Increment likes count
    await recipe.incrementLikes();

    res.json(
      ApiResponse.success(
        { likesCount: recipe.stats.likesCount + 1 },
        'Recipe liked successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/recipes/:id/like
 * @desc    Unlike a recipe
 * @access  Private
 */
const unlikeRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;

    // Delete like
    const like = await Like.findOneAndDelete({
      user: req.user._id,
      recipe: recipeId,
    });

    if (!like) {
      throw ApiError.notFound('Like not found');
    }

    // Decrement likes count
    const recipe = await Recipe.findById(recipeId);
    if (recipe) {
      await recipe.decrementLikes();
    }

    res.json(
      ApiResponse.success(
        { likesCount: recipe.stats.likesCount },
        'Recipe unliked successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/recipes/:id/save
 * @desc    Save a recipe
 * @access  Private
 */
const saveRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const { collection = 'default', notes } = req.body;

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe || recipe.deletedAt) {
      throw ApiError.notFound('Recipe not found');
    }

    // Check if already saved
    const existingSave = await SavedRecipe.findOne({
      user: req.user._id,
      recipe: recipeId,
    });

    if (existingSave) {
      throw ApiError.conflict('Recipe already saved');
    }

    // Create saved recipe
    await SavedRecipe.create({
      user: req.user._id,
      recipe: recipeId,
      collection,
      notes,
    });

    // Increment saves count
    await recipe.incrementSaves();

    res.json(
      ApiResponse.success(
        { savesCount: recipe.stats.savesCount + 1 },
        'Recipe saved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/recipes/:id/save
 * @desc    Unsave a recipe
 * @access  Private
 */
const unsaveRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;

    // Delete saved recipe
    const savedRecipe = await SavedRecipe.findOneAndDelete({
      user: req.user._id,
      recipe: recipeId,
    });

    if (!savedRecipe) {
      throw ApiError.notFound('Saved recipe not found');
    }

    // Decrement saves count
    const recipe = await Recipe.findById(recipeId);
    if (recipe) {
      await recipe.decrementSaves();
    }

    res.json(
      ApiResponse.success(
        { savesCount: recipe.stats.savesCount },
        'Recipe unsaved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};