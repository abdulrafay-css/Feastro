/**
 * Like Model - User likes on recipes
 * Tracks which user liked which recipe
 */

const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    schemaVersion: {
      type: Number,
      required: true,
      default: 1,
      immutable: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },

    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: [true, 'Recipe ID is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index - one user can only like a recipe once
likeSchema.index({ user: 1, recipe: 1 }, { unique: true });

// Index for querying
likeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Like', likeSchema);