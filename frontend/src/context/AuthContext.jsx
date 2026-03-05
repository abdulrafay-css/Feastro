import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@services/authService';
import { storageService } from '@services/storageService';
import toast from 'react-hot-toast';
import { SUCCESS_MESSAGES } from '@utils/constants';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is authenticated
        if (authService.isAuthenticated()) {
          // Get stored user
          const storedUser = authService.getStoredUser();
          
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
          } else {
            // Fetch current user from API
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid auth
        storageService.clearAuth();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login user
   */
  const login = async (credentials) => {
    try {
      await authService.login(credentials);
      const currentUser = await authService.getCurrentUser();
      
      setUser(currentUser);
      setIsAuthenticated(true);
      
      toast.success(SUCCESS_MESSAGES.LOGIN);
      return currentUser;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  /**
   * Register user
   */
  const register = async (userData) => {
    try {
      await authService.register(userData);
      const currentUser = await authService.getCurrentUser();
      
      setUser(currentUser);
      setIsAuthenticated(true);
      
      toast.success(SUCCESS_MESSAGES.REGISTER);
      return currentUser;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  /**
   * Login with Google
   */
  const loginWithGoogle = async (token) => {
    try {
      await authService.loginWithGoogle(token);
      const currentUser = await authService.getCurrentUser();
      
      setUser(currentUser);
      setIsAuthenticated(true);
      
      toast.success(SUCCESS_MESSAGES.LOGIN);
      return currentUser;
    } catch (error) {
      toast.error(error.message || 'Google login failed');
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Update user profile
   */
  const updateUser = async (userData) => {
    try {
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser);
      storageService.setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      storageService.setUser(currentUser);
      return currentUser;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};