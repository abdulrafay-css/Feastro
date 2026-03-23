/**
 * Design System Tokens - Feastro 2026
 * Single source of truth for all design decisions
 * 
 * Usage:
 * import { colors, typography, spacing } from '@/utils/designTokens';
 */

export const colors = {
  // Brand Colors
  brand: {
    primary: '#FF7A00',          // Main orange
    primaryHover: '#E66A00',     // Darker orange for hover
    primaryLight: '#FF9433',     // Lighter orange
    primaryDark: '#CC6200',      // Even darker orange
    secondary: '#2E75B6',        // Blue
    secondaryHover: '#1E5A9B',   // Darker blue
    accent: '#5B9BD5',           // Light blue accent
  },

  // Background Colors (Dark Mode First)
  bg: {
    primary: '#0A0A0A',          // True black base
    secondary: '#141414',        // Card background
    tertiary: '#1E1E1E',         // Elevated elements
    quaternary: '#282828',       // Hover states
    overlay: 'rgba(0, 0, 0, 0.8)',
    modalBackdrop: 'rgba(0, 0, 0, 0.95)',
  },

  // Glass Morphism Effects
  glass: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.1)',
    heavy: 'rgba(255, 255, 255, 0.15)',
    border: 'rgba(255, 255, 255, 0.1)',
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',          // Pure white
    secondary: '#E5E5E5',        // Light gray
    tertiary: '#A3A3A3',         // Medium gray
    disabled: '#666666',         // Disabled state
    inverse: '#0A0A0A',          // Black (for light backgrounds)
    brand: '#FF7A00',            // Brand color for emphasis
  },

  // Semantic Colors
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    bg: 'rgba(16, 185, 129, 0.1)',
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
    bg: 'rgba(239, 68, 68, 0.1)',
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
    bg: 'rgba(245, 158, 11, 0.1)',
  },
  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
    bg: 'rgba(59, 130, 246, 0.1)',
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #FF7A00 0%, #FF9433 100%)',
    primaryReverse: 'linear-gradient(135deg, #FF9433 0%, #FF7A00 100%)',
    overlay: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%)',
    overlayTop: 'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
    shimmer: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  },
};

export const typography = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    display: "'Poppins', sans-serif",
    mono: "'JetBrains Mono', 'Courier New', monospace",
  },

  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },

  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.05em',
  },
};

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  full: '9999px',
};

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  glow: '0 0 20px rgba(255, 122, 0, 0.4)',
  glowLarge: '0 0 40px rgba(255, 122, 0, 0.3)',
};

export const transitions = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
  },

  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
};

// Helper functions
export const getSpacing = (value) => spacing[value] || value;

export const getColor = (path) => {
  const keys = path.split('.');
  let result = colors;
  for (const key of keys) {
    result = result[key];
    if (!result) return path;
  }
  return result;
};

// Default export
export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  getSpacing,
  getColor,
};