import { get, post } from './api';
import { storageService } from './storageService';

/**
 * Authentication Service
 */
class AuthService {
  /**
   * Register new user
   */
  async register(userData) {
    try {
      const response = await post('/auth/register', {
        email: userData.email,
        username: userData.username,
        password: userData.password,
      });
      
      // Save tokens
      storageService.setAccessToken(response.access_token);
      storageService.setRefreshToken(response.refresh_token);
      
      // Fetch and save user data
      await this.getCurrentUser();
      
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Login user
   */
  async login(credentials) {
    try {
      const response = await post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });
      
      // Save tokens
      storageService.setAccessToken(response.access_token);
      storageService.setRefreshToken(response.refresh_token);
      
      // Fetch and save user data
      await this.getCurrentUser();
      
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Login with Google
   */
  async loginWithGoogle(token) {
    try {
      const response = await post('/auth/google', { token });
      
      // Save tokens
      storageService.setAccessToken(response.access_token);
      storageService.setRefreshToken(response.refresh_token);
      
      // Fetch and save user data
      await this.getCurrentUser();
      
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Logout user
   */
  async logout() {
    try {
      await post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      storageService.clearAuth();
    }
  }
  
  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const user = await get('/users/me');
      storageService.setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Refresh access token
   */
  async refreshToken() {
    try {
      const refreshToken = storageService.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await post('/auth/refresh', {
        refresh_token: refreshToken,
      });
      
      // Save new tokens
      storageService.setAccessToken(response.access_token);
      storageService.setRefreshToken(response.refresh_token);
      
      return response;
    } catch (error) {
      // Clear auth on refresh failure
      storageService.clearAuth();
      throw error;
    }
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return storageService.isAuthenticated();
  }
  
  /**
   * Get stored user
   */
  getStoredUser() {
    return storageService.getUser();
  }
}

export const authService = new AuthService();