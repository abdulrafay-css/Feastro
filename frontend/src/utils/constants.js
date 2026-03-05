// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
export const CDN_URL = import.meta.env.VITE_CDN_URL || 'http://localhost:8000';

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Feastro';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Feature Flags
export const FEATURES = {
  GOOGLE_AUTH: import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true',
  VIDEO_UPLOAD: import.meta.env.VITE_ENABLE_VIDEO_UPLOAD === 'true',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Video Configuration
export const VIDEO_CONFIG = {
  MAX_DURATION: 300, // 5 minutes in seconds
  SUPPORTED_FORMATS: ['mp4', 'webm', 'mov'],
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
};

// Recipe Configuration
export const RECIPE_CONFIG = {
  MAX_INGREDIENTS: 50,
  MAX_INSTRUCTIONS: 30,
  MAX_COOKING_TIME: 1440, // 24 hours in minutes
  MIN_COOKING_TIME: 1,
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const DIFFICULTY_LABELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export const DIFFICULTY_COLORS = {
  easy: 'text-green-500',
  medium: 'text-yellow-500',
  hard: 'text-red-500',
};

// Dietary Preferences
export const DIETARY_PREFERENCES = {
  NONE: 'none',
  VEGETARIAN: 'vegetarian',
  VEGAN: 'vegan',
  GLUTEN_FREE: 'gluten_free',
  KETO: 'keto',
  PALEO: 'paleo',
};

export const DIETARY_LABELS = {
  none: 'No Preference',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  gluten_free: 'Gluten Free',
  keto: 'Keto',
  paleo: 'Paleo',
};

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'feastro_access_token',
  REFRESH_TOKEN: 'feastro_refresh_token',
  USER: 'feastro_user',
  THEME: 'feastro_theme',
};

// Routes
export const ROUTES = {
  HOME: '/',
  FEED: '/feed',
  SEARCH: '/search',
  SAVED: '/saved',
  PROFILE: '/profile/:username',
  MY_PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  RECIPE: '/recipe/:id',
};

// Engagement Types
export const ENGAGEMENT_TYPES = {
  VIEW: 'view',
  LIKE: 'like',
  SAVE: 'save',
  SHARE: 'share',
  WATCH_COMPLETE: 'watch_complete',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  REGISTER: 'Account created successfully!',
  RECIPE_CREATED: 'Recipe created successfully!',
  RECIPE_UPDATED: 'Recipe updated successfully!',
  RECIPE_DELETED: 'Recipe deleted successfully!',
  RECIPE_LIKED: 'Recipe liked!',
  RECIPE_SAVED: 'Recipe saved!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  FOLLOW_SUCCESS: 'Followed successfully!',
  UNFOLLOW_SUCCESS: 'Unfollowed successfully!',
};

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};