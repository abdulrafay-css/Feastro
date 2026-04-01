/**
 * User Model - MongoDB Schema
 * Comprehensive validation and schema versioning
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isValidEmail, isValidUsername, isValidUrl } = require('../utils/validators');

const userSchema = new mongoose.Schema(
  {
    // ============================================
    // SCHEMA VERSION (for data migrations)
    // ============================================
    schemaVersion: {
      type: Number,
      required: true,
      default: 1,
      immutable: true, // Can't be changed after creation
    },

    // ============================================
    // BASIC INFO
    // ============================================
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      validate: {
        validator: isValidUsername,
        message: 'Username can only contain letters, numbers, and underscores',
      },
      index: true, // Performance optimization
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: isValidEmail,
        message: 'Please provide a valid email address',
      },
      index: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },

    // ============================================
    // PROFILE
    // ============================================
    avatar: {
      type: String,
      default: null,
      validate: {
        validator: function(v) {
          return !v || isValidUrl(v);
        },
        message: 'Avatar must be a valid URL',
      },
    },

    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: null,
    },

    coverImage: {
      type: String,
      default: null,
      validate: {
        validator: function(v) {
          return !v || isValidUrl(v);
        },
        message: 'Cover image must be a valid URL',
      },
    },

    // ============================================
    // STATUS FLAGS
    // ============================================
    verified: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },

    isCreator: {
      type: Boolean,
      default: false,
      index: true,
    },

    // ============================================
    // SOCIAL LINKS
    // ============================================
    socialLinks: {
      instagram: {
        type: String,
        maxlength: [100, 'Instagram username too long'],
        default: null,
      },
      youtube: {
        type: String,
        validate: {
          validator: function(v) {
            return !v || isValidUrl(v);
          },
          message: 'YouTube link must be a valid URL',
        },
        default: null,
      },
      website: {
        type: String,
        validate: {
          validator: function(v) {
            return !v || isValidUrl(v);
          },
          message: 'Website must be a valid URL',
        },
        default: null,
      },
    },

    // ============================================
    // STATS (updated via hooks/services)
    // ============================================
    stats: {
      followersCount: {
        type: Number,
        default: 0,
        min: [0, 'Followers count cannot be negative'],
      },
      followingCount: {
        type: Number,
        default: 0,
        min: [0, 'Following count cannot be negative'],
      },
      recipesCount: {
        type: Number,
        default: 0,
        min: [0, 'Recipes count cannot be negative'],
      },
      totalLikes: {
        type: Number,
        default: 0,
        min: [0, 'Total likes cannot be negative'],
      },
    },

    // ============================================
    // PREFERENCES (from onboarding)
    // ============================================
    preferences: {
      dietaryRestrictions: [{
        type: String,
        enum: {
          values: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb', 'high-protein', 'nut-free'],
          message: '{VALUE} is not a valid dietary restriction',
        },
      }],
      cuisinePreferences: [{
        type: String,
        enum: ['italian', 'chinese', 'mexican', 'indian', 'japanese', 'thai', 'french', 'american', 'middle-eastern', 'korean'],
      }],
      skillLevel: {
        type: String,
        enum: {
          values: ['beginner', 'intermediate', 'advanced'],
          message: '{VALUE} is not a valid skill level',
        },
        default: 'beginner',
      },
      cookingTime: {
        type: String,
        enum: ['any', 'quick', 'medium', 'long'],
        default: 'any',
      },
    },

    // ============================================
    // METADATA
    // ============================================
    lastLogin: {
      type: Date,
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null, // Soft delete support
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================
// INDEXES (for query performance)
// ============================================
userSchema.index({ email: 1, username: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ isCreator: 1, verified: 1 });

// ============================================
// VIRTUAL FIELDS
// ============================================
userSchema.virtual('fullStats').get(function() {
  return {
    followers: this.stats.followersCount,
    following: this.stats.followingCount,
    recipes: this.stats.recipesCount,
    likes: this.stats.totalLikes,
  };
});

// ============================================
// PRE-SAVE HOOKS
// ============================================

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Update lastLogin on save
userSchema.pre('save', function(next) {
  if (this.isNew) {
    this.lastLogin = new Date();
  }
  next();
});

// ============================================
// INSTANCE METHODS
// ============================================

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile (safe to send to frontend)
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    username: this.username,
    email: this.email,
    avatar: this.avatar,
    bio: this.bio,
    coverImage: this.coverImage,
    verified: this.verified,
    isCreator: this.isCreator,
    socialLinks: this.socialLinks,
    stats: this.stats,
    createdAt: this.createdAt,
  };
};

// ============================================
// STATIC METHODS
// ============================================

// Find by username or email
userSchema.statics.findByCredentials = async function(identifier) {
  return await this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier.toLowerCase() },
    ],
  }).select('+password');
};

// Check if username exists
userSchema.statics.usernameExists = async function(username) {
  const user = await this.findOne({ username: username.toLowerCase() });
  return !!user;
};

// Check if email exists
userSchema.statics.emailExists = async function(email) {
  const user = await this.findOne({ email: email.toLowerCase() });
  return !!user;
};

module.exports = mongoose.model('User', userSchema);