import { get, post, put, del } from './api';

/**
 * Recipe Service
 */
class RecipeService {
  /**
   * Get recipe feed
   */
  async getFeed(page = 1, pageSize = 10) {
    try {
      const skip = (page - 1) * pageSize;
      return await get(`/recipes/feed/discover?skip=${skip}&limit=${pageSize}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get personalized feed
   */
  async getPersonalizedFeed(page = 1, pageSize = 10, excludeSeen = true) {
    try {
      const skip = (page - 1) * pageSize;
      return await get(
        `/recommendations/feed?skip=${skip}&limit=${pageSize}&exclude_seen=${excludeSeen}`
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get recipe by ID
   */
  async getRecipeById(id) {
    try {
      return await get(`/recipes/${id}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Create new recipe
   */
  async createRecipe(recipeData) {
    try {
      return await post('/recipes', recipeData);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Update recipe
   */
  async updateRecipe(id, recipeData) {
    try {
      return await put(`/recipes/${id}`, recipeData);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Delete recipe
   */
  async deleteRecipe(id) {
    try {
      return await del(`/recipes/${id}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Like recipe
   */
  async likeRecipe(recipeId) {
    try {
      return await post('/engagement/like', { recipe_id: recipeId });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Unlike recipe
   */
  async unlikeRecipe(recipeId) {
    try {
      return await del(`/engagement/like/${recipeId}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Save recipe
   */
  async saveRecipe(recipeId) {
    try {
      return await post('/engagement/save', { recipe_id: recipeId });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Unsave recipe
   */
  async unsaveRecipe(recipeId) {
    try {
      return await del(`/engagement/save/${recipeId}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get saved recipes
   */
  async getSavedRecipes(page = 1, pageSize = 20) {
    try {
      const skip = (page - 1) * pageSize;
      return await get(`/engagement/saved?skip=${skip}&limit=${pageSize}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get engagement stats
   */
  async getEngagementStats(recipeId) {
    try {
      return await get(`/engagement/stats/${recipeId}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Log engagement
   */
  async logEngagement(engagementData) {
    try {
      return await post('/engagement/log', engagementData);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Search recipes
   */
  async searchRecipes(filters, page = 1, pageSize = 20) {
    try {
      const skip = (page - 1) * pageSize;
      const params = new URLSearchParams({
        skip,
        limit: pageSize,
        ...filters,
      });
      
      return await get(`/search/recipes?${params}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get trending recipes
   */
  async getTrendingRecipes(limit = 20) {
    try {
      return await get(`/search/trending?limit=${limit}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get similar recipes
   */
  async getSimilarRecipes(recipeId, limit = 10) {
    try {
      return await get(`/recommendations/similar/${recipeId}?limit=${limit}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get user preferences
   */
  async getUserPreferences() {
    try {
      return await get('/recommendations/preferences');
    } catch (error) {
      throw error;
    }
  }
}

export const recipeService = new RecipeService();