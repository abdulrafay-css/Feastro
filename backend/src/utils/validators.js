/**
 * Custom Validators
 * Reusable validation functions
 */

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate username (alphanumeric + underscore only)
 */
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

/**
 * Validate URL format
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate cooking time (1-1440 minutes)
 */
const isValidCookingTime = (time) => {
  return Number.isInteger(time) && time >= 1 && time <= 1440;
};

/**
 * Validate difficulty level
 */
const isValidDifficulty = (difficulty) => {
  return ['easy', 'medium', 'hard'].includes(difficulty.toLowerCase());
};

/**
 * Validate category
 */
const isValidCategory = (category) => {
  const validCategories = [
    'budget', 'quick', 'spicy', 'healthy', 
    'comfort', 'protein', 'late-night', 
    'breakfast', 'vegetarian'
  ];
  return validCategories.includes(category.toLowerCase());
};

module.exports = {
  isValidEmail,
  isValidUsername,
  isValidUrl,
  isValidCookingTime,
  isValidDifficulty,
  isValidCategory,
};