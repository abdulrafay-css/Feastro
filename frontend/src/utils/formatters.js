/**
 * Utility Functions for Formatting Data
 * Number formatting, date formatting, time formatting, etc.
 * 
 * Usage:
 * import { formatNumber, formatTime } from '@/utils/formatters';
 */

// ============================================
// NUMBER FORMATTING
// ============================================

/**
 * Format large numbers with K/M suffix
 * @param {number} num - Number to format
 * @returns {string} Formatted number (e.g., "1.2K", "3.5M")
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number (e.g., "1,234,567")
 */
export const formatNumberWithCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format percentage
 * @param {number} num - Number to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage (e.g., "75.5%")
 */
export const formatPercentage = (num, decimals = 1) => {
  return num.toFixed(decimals) + '%';
};

// ============================================
// TIME FORMATTING
// ============================================

/**
 * Format cooking time in minutes to human-readable string
 * @param {number} minutes - Time in minutes
 * @returns {string} Formatted time (e.g., "15 min", "1h 30m")
 */
export const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Format seconds to MM:SS
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time (e.g., "02:45")
 */
export const formatSeconds = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format duration for video player
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration (e.g., "1:23:45" or "23:45")
 */
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// ============================================
// DATE FORMATTING
// ============================================

/**
 * Format date to relative time (e.g., "2h ago", "3d ago")
 * @param {string|Date} dateString - Date to format
 * @returns {string} Relative time string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  
  return date.toLocaleDateString();
};

/**
 * Format date to specific format
 * @param {string|Date} dateString - Date to format
 * @param {string} format - Format type ('short', 'long', 'full')
 * @returns {string} Formatted date
 */
export const formatDateString = (dateString, format = 'short') => {
  const date = new Date(dateString);
  
  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
  };
  
  return date.toLocaleDateString('en-US', options[format] || options.short);
};

// ============================================
// TEXT FORMATTING
// ============================================

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Slugify text for URLs
 * @param {string} text - Text to slugify
 * @returns {string} Slugified text
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// ============================================
// DIFFICULTY FORMATTING
// ============================================

/**
 * Get color for difficulty level
 * @param {string} difficulty - Difficulty level ('easy', 'medium', 'hard')
 * @returns {string} Hex color code
 */
export const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: '#10B981',
    medium: '#F59E0B',
    hard: '#EF4444',
  };
  return colors[difficulty?.toLowerCase()] || '#A3A3A3';
};

/**
 * Get label for difficulty level
 * @param {string} difficulty - Difficulty level
 * @returns {string} Formatted label
 */
export const getDifficultyLabel = (difficulty) => {
  if (!difficulty) return 'Unknown';
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
};

// ============================================
// INGREDIENT FORMATTING
// ============================================

/**
 * Format ingredient amount
 * @param {number} amount - Amount value
 * @param {string} unit - Unit of measurement
 * @returns {string} Formatted ingredient amount
 */
export const formatIngredient = (amount, unit) => {
  // Handle fractions
  if (amount < 1 && amount > 0) {
    const fractions = {
      0.25: '¼',
      0.33: '⅓',
      0.5: '½',
      0.66: '⅔',
      0.75: '¾',
    };
    const fraction = fractions[amount.toFixed(2)];
    if (fraction) return `${fraction} ${unit}`;
  }
  
  // Handle whole numbers
  if (Number.isInteger(amount)) {
    return `${amount} ${unit}`;
  }
  
  // Handle decimals
  return `${amount.toFixed(1)} ${unit}`;
};

// ============================================
// FILE SIZE FORMATTING
// ============================================

/**
 * Format file size in bytes to human-readable string
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// ============================================
// CURRENCY FORMATTING
// ============================================

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency (e.g., "$10.99")
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// ============================================
// RATING FORMATTING
// ============================================

/**
 * Format rating to stars
 * @param {number} rating - Rating value (0-5)
 * @returns {string} Star representation
 */
export const formatRating = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '½' : '') + 
         '☆'.repeat(emptyStars);
};

/**
 * Format rating with decimal
 * @param {number} rating - Rating value
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted rating (e.g., "4.5")
 */
export const formatRatingNumber = (rating, decimals = 1) => {
  return rating.toFixed(decimals);
};

// ============================================
// ARRAY FORMATTING
// ============================================

/**
 * Format array to comma-separated string with "and"
 * @param {Array} arr - Array to format
 * @returns {string} Formatted string (e.g., "apples, oranges, and bananas")
 */
export const formatList = (arr) => {
  if (!arr || arr.length === 0) return '';
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  return `${arr.slice(0, -1).join(', ')}, and ${arr[arr.length - 1]}`;
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
  // Numbers
  formatNumber,
  formatNumberWithCommas,
  formatPercentage,
  
  // Time
  formatTime,
  formatSeconds,
  formatDuration,
  
  // Date
  formatDate,
  formatDateString,
  
  // Text
  truncateText,
  capitalize,
  toTitleCase,
  slugify,
  
  // Difficulty
  getDifficultyColor,
  getDifficultyLabel,
  
  // Ingredients
  formatIngredient,
  
  // File
  formatFileSize,
  
  // Currency
  formatCurrency,
  
  // Rating
  formatRating,
  formatRatingNumber,
  
  // Array
  formatList,
};