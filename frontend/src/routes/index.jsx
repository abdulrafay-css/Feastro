/**
 * Route Configuration
 * Centralized route definitions
 */

import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('../pages/HomePage'));
const FeedPage = lazy(() => import('../pages/FeedPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const SavedPage = lazy(() => import('../pages/SavedPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));

/**
 * Route Types:
 * - public: Accessible without authentication
 * - private: Requires authentication
 * - auth: Only for non-authenticated users (login/register)
 */

export const routes = [
  // Auth Routes (only for non-authenticated)
  {
    path: '/login',
    element: LoginPage,
    type: 'auth',
    title: 'Login',
  },
  {
    path: '/register',
    element: RegisterPage,
    type: 'auth',
    title: 'Register',
  },

  // Private Routes (requires authentication)
  {
    path: '/',
    element: HomePage,
    type: 'private',
    title: 'Home',
    showNav: true,
  },
  {
    path: '/feed',
    element: FeedPage,
    type: 'private',
    title: 'Feed',
    showNav: false,
  },
  {
    path: '/search',
    element: SearchPage,
    type: 'private',
    title: 'Search',
    showNav: true,
  },
  {
    path: '/saved',
    element: SavedPage,
    type: 'private',
    title: 'Saved',
    showNav: true,
  },
  {
    path: '/profile',
    element: ProfilePage,
    type: 'private',
    title: 'Profile',
    showNav: true,
  },
  {
    path: '/profile/:username',
    element: ProfilePage,
    type: 'private',
    title: 'Profile',
    showNav: true,
  },
];

/**
 * Generate route elements for React Router
 */
export const generateRoutes = (isAuthenticated) => {
  return routes.map((route) => {
    // Auth routes - redirect to home if authenticated
    if (route.type === 'auth' && isAuthenticated) {
      return {
        ...route,
        element: <Navigate to="/" replace />,
      };
    }

    // Private routes - redirect to login if not authenticated
    if (route.type === 'private' && !isAuthenticated) {
      return {
        ...route,
        element: <Navigate to="/login" replace />,
      };
    }

    return route;
  });
};

/**
 * Get current route config
 */
export const getCurrentRoute = (pathname) => {
  return routes.find((route) => {
    if (route.path === pathname) return true;
    if (route.path.includes(':')) {
      const routeParts = route.path.split('/');
      const pathParts = pathname.split('/');
      if (routeParts.length !== pathParts.length) return false;
      return routeParts.every((part, i) => 
        part.startsWith(':') || part === pathParts[i]
      );
    }
    return false;
  });
};