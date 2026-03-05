import { STORAGE_KEYS } from '@utils/constants';

/**
 * Storage Service - Handle localStorage operations
 */
class StorageService {
  /**
   * Get item from localStorage
   */
  getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }
  
  /**
   * Set item in localStorage
   */
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  }
  
  /**
   * Remove item from localStorage
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
  
  /**
   * Clear all items from localStorage
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
  
  // Auth-specific methods
  
  /**
   * Get access token
   */
  getAccessToken() {
    return this.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }
  
  /**
   * Set access token
   */
  setAccessToken(token) {
    return this.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }
  
  /**
   * Get refresh token
   */
  getRefreshToken() {
    return this.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
  
  /**
   * Set refresh token
   */
  setRefreshToken(token) {
    return this.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }
  
  /**
   * Get user data
   */
  getUser() {
    return this.getItem(STORAGE_KEYS.USER);
  }
  
  /**
   * Set user data
   */
  setUser(user) {
    return this.setItem(STORAGE_KEYS.USER, user);
  }
  
  /**
   * Clear auth data
   */
  clearAuth() {
    this.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    this.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    this.removeItem(STORAGE_KEYS.USER);
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getAccessToken();
  }
  
  // Theme methods
  
  /**
   * Get theme
   */
  getTheme() {
    return this.getItem(STORAGE_KEYS.THEME) || 'dark';
  }
  
  /**
   * Set theme
   */
  setTheme(theme) {
    return this.setItem(STORAGE_KEYS.THEME, theme);
  }
}

export const storageService = new StorageService();