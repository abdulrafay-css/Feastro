/**
 * SavedRecipe Model - User saved recipes
 * Tracks which user saved which recipe
 */

const mongoose = require('mongoose');

const savedRecipeSchema = new mongoose.Schema(
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

    collection: {
      type: String,
      default: 'default',
      trim: true,
      maxlength: [100, 'Collection name too long'],
    },

    notes: {
      type: String,
      maxlength: [500, 'Notes too long'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index - one user can only save a recipe once
savedRecipeSchema.index({ user: 1, recipe: 1 }, { unique: true });

// Index for collections
savedRecipeSchema.index({ user: 1, collection: 1 });

module.exports = mongoose.model('SavedRecipe', savedRecipeSchema);