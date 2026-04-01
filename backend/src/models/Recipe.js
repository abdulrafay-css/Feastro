/**
 * Recipe Model - MongoDB Schema
 * Comprehensive validation for recipe data
 */

const mongoose = require('mongoose');
const { isValidUrl, isValidCookingTime, isValidDifficulty, isValidCategory } = require('../utils/validators');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ingredient name is required'],
    trim: true,
    maxlength: [200, 'Ingredient name too long'],
  },
  amount: {
    type: Number,
    min: [0, 'Amount cannot be negative'],
  },
  unit: {
    type: String,
    trim: true,
    maxlength: [50, 'Unit too long'],
  },
}, { _id: false });

const instructionSchema = new mongoose.Schema({
  step: {
    type: Number,
    required: [true, 'Step number is required'],
    min: [1, 'Step number must be at least 1'],
  },
  text: {
    type: String,
    required: [true, 'Instruction text is required'],
    trim: true,
    minlength: [10, 'Instruction must be at least 10 characters'],
    maxlength: [1000, 'Instruction too long'],
  },
}, { _id: false });

const recipeSchema = new mongoose.Schema(
  {
    // ============================================
    // SCHEMA VERSION
    // ============================================
    schemaVersion: {
      type: Number,
      required: true,
      default: 1,
      immutable: true,
    },

    // ============================================
    // CREATOR (REFERENCE)
    // ============================================
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipe must have a creator'],
      index: true,
    },

    // ============================================
    // BASIC INFO
    // ============================================
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },

    // ============================================
    // MEDIA (AWS S3 URLS)
    // ============================================
    thumbnail: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || isValidUrl(v);
        },
        message: 'Thumbnail must be a valid URL',
      },
    },

    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
      validate: {
        validator: isValidUrl,
        message: 'Video URL must be valid',
      },
    },

    // ============================================
    // RECIPE DETAILS
    // ============================================
    cookingTime: {
      type: Number,
      min: [1, 'Cooking time must be at least 1 minute'],
      max: [1440, 'Cooking time cannot exceed 24 hours'],
      validate: {
        validator: function(v) {
          return !v || isValidCookingTime(v);
        },
        message: 'Invalid cooking time',
      },
    },

    servings: {
      type: Number,
      required: [true, 'Servings is required'],
      min: [1, 'Must serve at least 1 person'],
      max: [100, 'Cannot exceed 100 servings'],
      default: 4,
    },

    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: '{VALUE} is not a valid difficulty level',
      },
      lowercase: true,
      index: true,
    },

    // ============================================
    // INGREDIENTS & INSTRUCTIONS
    // ============================================
    ingredients: {
      type: [ingredientSchema],
      validate: {
        validator: function(v) {
          return !v || v.length > 0;
        },
        message: 'Recipe must have at least one ingredient',
      },
    },

    instructions: {
      type: [instructionSchema],
      validate: {
        validator: function(v) {
          return !v || v.length > 0;
        },
        message: 'Recipe must have at least one instruction',
      },
    },

    // ============================================
    // CATEGORIES & TAGS
    // ============================================
    category: {
      type: String,
      enum: {
        values: ['budget', 'quick', 'spicy', 'healthy', 'comfort', 'protein', 'late-night', 'breakfast', 'vegetarian'],
        message: '{VALUE} is not a valid category',
      },
      lowercase: true,
      index: true,
    },

    cuisine: {
      type: String,
      enum: ['italian', 'chinese', 'mexican', 'indian', 'japanese', 'thai', 'french', 'american', 'middle-eastern', 'korean', 'pakistani', 'fusion'],
      lowercase: true,
      index: true,
    },

    dietary: [{
      type: String,
      enum: {
        values: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb', 'high-protein', 'nut-free'],
        message: '{VALUE} is not a valid dietary option',
      },
      lowercase: true,
    }],

    tags: [{
      type: String,
      lowercase: true,
      trim: true,
      maxlength: [30, 'Tag too long'],
    }],

    // ============================================
    // ADDITIONAL INFO
    // ============================================
    tips: {
      type: String,
      maxlength: [1000, 'Tips cannot exceed 1000 characters'],
    },

    nutritionInfo: {
      calories: { type: Number, min: 0 },
      protein: { type: Number, min: 0 },
      carbs: { type: Number, min: 0 },
      fat: { type: Number, min: 0 },
      fiber: { type: Number, min: 0 },
    },

    // ============================================
    // ENGAGEMENT STATS
    // ============================================
    stats: {
      likesCount: {
        type: Number,
        default: 0,
        min: [0, 'Likes cannot be negative'],
      },
      savesCount: {
        type: Number,
        default: 0,
        min: [0, 'Saves cannot be negative'],
      },
      viewsCount: {
        type: Number,
        default: 0,
        min: [0, 'Views cannot be negative'],
      },
      commentsCount: {
        type: Number,
        default: 0,
        min: [0, 'Comments cannot be negative'],
      },
      sharesCount: {
        type: Number,
        default: 0,
        min: [0, 'Shares cannot be negative'],
      },
    },

    // ============================================
    // STATUS
    // ============================================
    isPublished: {
      type: Boolean,
      default: true,
      required: true,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null, // Soft delete
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================
// INDEXES (Performance)
// ============================================
recipeSchema.index({ creator: 1, isPublished: 1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ 'stats.likesCount': -1 });
recipeSchema.index({ 'stats.viewsCount': -1 });
recipeSchema.index({ category: 1, difficulty: 1 });
recipeSchema.index({ title: 'text', description: 'text' }); // Text search

// ============================================
// VIRTUAL FIELDS
// ============================================
recipeSchema.virtual('totalEngagement').get(function() {
  return (
    this.stats.likesCount +
    this.stats.savesCount +
    this.stats.commentsCount +
    this.stats.sharesCount
  );
});

recipeSchema.virtual('engagementRate').get(function() {
  if (this.stats.viewsCount === 0) return 0;
  return ((this.totalEngagement / this.stats.viewsCount) * 100).toFixed(2);
});

// ============================================
// PRE-SAVE HOOKS
// ============================================
recipeSchema.pre('save', function(next) {
  if (this.isNew && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// ============================================
// INSTANCE METHODS
// ============================================
recipeSchema.methods.incrementViews = async function() {
  this.stats.viewsCount += 1;
  await this.save();
};

recipeSchema.methods.incrementLikes = async function() {
  this.stats.likesCount += 1;
  await this.save();
};

recipeSchema.methods.decrementLikes = async function() {
  this.stats.likesCount = Math.max(0, this.stats.likesCount - 1);
  await this.save();
};

recipeSchema.methods.incrementSaves = async function() {
  this.stats.savesCount += 1;
  await this.save();
};

recipeSchema.methods.decrementSaves = async function() {
  this.stats.savesCount = Math.max(0, this.stats.savesCount - 1);
  await this.save();
};

// ============================================
// STATIC METHODS
// ============================================
recipeSchema.statics.findPublished = function() {
  return this.find({ isPublished: true, deletedAt: null });
};

recipeSchema.statics.findByCreator = function(creatorId) {
  return this.find({ creator: creatorId, deletedAt: null });
};

recipeSchema.statics.findTrending = function(limit = 10) {
  return this.find({ isPublished: true, deletedAt: null })
    .sort({ 'stats.viewsCount': -1, 'stats.likesCount': -1 })
    .limit(limit)
    .populate('creator', 'name username avatar verified');
};

module.exports = mongoose.model('Recipe', recipeSchema);