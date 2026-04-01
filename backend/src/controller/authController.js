/**
 * Authentication Controller
 * Handles user registration, login, and authentication
 */

const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    // Check if email already exists
    const emailExists = await User.emailExists(email);
    if (emailExists) {
      throw ApiError.conflict('Email already registered');
    }

    // Check if username already exists
    const usernameExists = await User.usernameExists(username);
    if (usernameExists) {
      throw ApiError.conflict('Username already taken');
    }

    // Create user
    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    // Generate token
    const token = generateToken({ userId: user._id });

    // Get public profile
    const userProfile = user.getPublicProfile();

    res.status(201).json(
      ApiResponse.created(
        {
          token,
          user: userProfile,
        },
        'Account created successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email (with password field)
    const user = await User.findByCredentials(email);

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Check if account is active
    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({ userId: user._id });

    // Get public profile
    const userProfile = user.getPublicProfile();

    res.json(
      ApiResponse.success(
        {
          token,
          user: userProfile,
        },
        'Login successful'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
const getCurrentUser = async (req, res, next) => {
  try {
    // User already attached by protect middleware
    const userProfile = req.user.getPublicProfile();

    res.json(
      ApiResponse.success(userProfile, 'User profile retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    // Note: With JWT, logout is handled client-side by removing the token
    // This endpoint is here for consistency and future token blacklisting
    
    res.json(
      ApiResponse.success(null, 'Logout successful')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/auth/onboarding
 * @desc    Save onboarding preferences
 * @access  Private
 */
const saveOnboardingPreferences = async (req, res, next) => {
  try {
    const { dietaryRestrictions, cuisinePreferences, skillLevel, cookingTime } = req.body;

    const user = await User.findById(req.user._id);

    // Update preferences
    user.preferences = {
      dietaryRestrictions: dietaryRestrictions || [],
      cuisinePreferences: cuisinePreferences || [],
      skillLevel: skillLevel || 'beginner',
      cookingTime: cookingTime || 'any',
    };

    await user.save();

    const userProfile = user.getPublicProfile();

    res.json(
      ApiResponse.success(userProfile, 'Preferences saved successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logout,
  saveOnboardingPreferences,
};