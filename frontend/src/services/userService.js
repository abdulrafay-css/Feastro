import { get, post, put, del } from './api';

/**
 * User Service
 */
class UserService {
  /**
   * Get current user profile
   */
  async getCurrentUser() {
    try {
      return await get('/users/me');
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Update current user
   */
  async updateCurrentUser(userData) {
    try {
      return await put('/users/me', userData);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get user profile by username
   */
  async getUserProfile(username) {
    try {
      return await get(`/users/${username}/profile`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Follow user
   */
  async followUser(userId) {
    try {
      return await post(`/users/${userId}/follow`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Unfollow user
   */
  async unfollowUser(userId) {
    try {
      return await del(`/users/${userId}/follow`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get user followers
   */
  async getFollowers(userId, page = 1, pageSize = 20) {
    try {
      const skip = (page - 1) * pageSize;
      return await get(`/users/${userId}/followers?skip=${skip}&limit=${pageSize}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get user following
   */
  async getFollowing(userId, page = 1, pageSize = 20) {
    try {
      const skip = (page - 1) * pageSize;
      return await get(`/users/${userId}/following?skip=${skip}&limit=${pageSize}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get user recipes
   */
  async getUserRecipes(userId, page = 1, pageSize = 20) {
    try {
      const skip = (page - 1) * pageSize;
      return await get(`/recipes?author_id=${userId}&skip=${skip}&limit=${pageSize}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Search users
   */
  async searchUsers(query, page = 1, pageSize = 20) {
    try {
      const skip = (page - 1) * pageSize;
      return await get(`/search/users?query=${query}&skip=${skip}&limit=${pageSize}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Upload avatar
   */
  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // This endpoint would need to be implemented in the backend
      // For now, this is a placeholder
      return await post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService();