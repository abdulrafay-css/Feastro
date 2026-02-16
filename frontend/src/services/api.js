import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS, ERROR_MESSAGES } from '@utils/constants';
import { storageService } from './storageService';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = storageService.getAccessToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = storageService.getRefreshToken();
        
        if (refreshToken) {
          // Attempt to refresh token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          
          const { access_token, refresh_token } = response.data;
          
          // Save new tokens
          storageService.setAccessToken(access_token);
          storageService.setRefreshToken(refresh_token);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - Clear tokens and redirect to login
        storageService.clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    return Promise.reject(handleApiError(error));
  }
);

/**
 * Handle API errors and return user-friendly messages
 */
const handleApiError = (error) => {
  if (!error.response) {
    // Network error
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      status: 0,
      data: null,
    };
  }
  
  const { status, data } = error.response;
  
  let message = ERROR_MESSAGES.SERVER_ERROR;
  
  switch (status) {
    case 400:
      message = data?.detail || ERROR_MESSAGES.VALIDATION_ERROR;
      break;
    case 401:
      message = ERROR_MESSAGES.AUTH_ERROR;
      break;
    case 403:
      message = 'You do not have permission to perform this action.';
      break;
    case 404:
      message = ERROR_MESSAGES.NOT_FOUND;
      break;
    case 422:
      message = data?.detail || ERROR_MESSAGES.VALIDATION_ERROR;
      break;
    case 429:
      message = 'Too many requests. Please try again later.';
      break;
    case 500:
    case 502:
    case 503:
      message = ERROR_MESSAGES.SERVER_ERROR;
      break;
    default:
      message = data?.detail || ERROR_MESSAGES.SERVER_ERROR;
  }
  
  return {
    message,
    status,
    data,
  };
};

/**
 * Generic GET request
 */
export const get = async (url, config = {}) => {
  try {
    const response = await api.get(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Generic POST request
 */
export const post = async (url, data = {}, config = {}) => {
  try {
    const response = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Generic PUT request
 */
export const put = async (url, data = {}, config = {}) => {
  try {
    const response = await api.put(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Generic PATCH request
 */
export const patch = async (url, data = {}, config = {}) => {
  try {
    const response = await api.patch(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Generic DELETE request
 */
export const del = async (url, config = {}) => {
  try {
    const response = await api.delete(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;