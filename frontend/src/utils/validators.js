/**
 * Validate email
 */
export const validateEmail = (email) => {
  if (!email) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  
  return null;
};

/**
 * Validate password
 */
export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  return null;
};

/**
 * Validate username
 */
export const validateUsername = (username) => {
  if (!username) {
    return 'Username is required';
  }
  
  if (username.length < 3) {
    return 'Username must be at least 3 characters';
  }
  
  if (username.length > 50) {
    return 'Username must not exceed 50 characters';
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  
  return null;
};

/**
 * Validate recipe title
 */
export const validateRecipeTitle = (title) => {
  if (!title) {
    return 'Recipe title is required';
  }
  
  if (title.length < 3) {
    return 'Title must be at least 3 characters';
  }
  
  if (title.length > 255) {
    return 'Title must not exceed 255 characters';
  }
  
  return null;
};

/**
 * Validate cooking time
 */
export const validateCookingTime = (time) => {
  if (!time) {
    return 'Cooking time is required';
  }
  
  const timeNum = parseInt(time);
  
  if (isNaN(timeNum) || timeNum < 1) {
    return 'Cooking time must be at least 1 minute';
  }
  
  if (timeNum > 1440) {
    return 'Cooking time cannot exceed 24 hours';
  }
  
  return null;
};

/**
 * Validate servings
 */
export const validateServings = (servings) => {
  if (!servings) {
    return 'Servings is required';
  }
  
  const servingsNum = parseInt(servings);
  
  if (isNaN(servingsNum) || servingsNum < 1) {
    return 'Servings must be at least 1';
  }
  
  if (servingsNum > 100) {
    return 'Servings cannot exceed 100';
  }
  
  return null;
};

/**
 * Validate ingredients list
 */
export const validateIngredients = (ingredients) => {
  if (!ingredients || ingredients.length === 0) {
    return 'At least one ingredient is required';
  }
  
  for (const ingredient of ingredients) {
    if (!ingredient.name || !ingredient.quantity) {
      return 'All ingredients must have a name and quantity';
    }
  }
  
  return null;
};

/**
 * Validate instructions list
 */
export const validateInstructions = (instructions) => {
  if (!instructions || instructions.length === 0) {
    return 'At least one instruction step is required';
  }
  
  for (const instruction of instructions) {
    if (!instruction.instruction) {
      return 'All instruction steps must have content';
    }
  }
  
  return null;
};

/**
 * Validate URL
 */
export const validateUrl = (url) => {
  if (!url) {
    return 'URL is required';
  }
  
  try {
    new URL(url);
    return null;
  } catch {
    return 'Invalid URL format';
  }
};

/**
 * Validate bio
 */
export const validateBio = (bio) => {
  if (bio && bio.length > 500) {
    return 'Bio must not exceed 500 characters';
  }
  
  return null;
};