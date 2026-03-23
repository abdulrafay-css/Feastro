/**
 * Tailwind CSS Configuration
 * Custom theme extending Tailwind defaults
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand color
        primary: {
          DEFAULT: '#FF7A00',
          light: '#FF9433',
          dark: '#E66D00',
        },
        // Background colors
        bg: {
          primary: '#0A0A0A',
          secondary: '#141414',
          tertiary: '#1F1F1F',
        },
        // Difficulty colors
        difficulty: {
          easy: '#10B981',
          medium: '#F59E0B',
          hard: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',      // 12px
        'sm': '0.875rem',     // 14px
        'base': '1rem',       // 16px
        'lg': '1.125rem',     // 18px
        'xl': '1.25rem',      // 20px
        '2xl': '1.5rem',      // 24px
        '3xl': '1.875rem',    // 30px
        '4xl': '2.25rem',     // 36px
        '5xl': '3rem',        // 48px
        '6xl': '3.75rem',     // 60px
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        'xs': '0.25rem',
        'sm': '0.375rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(255, 122, 0, 0.2)',
        'glow': '0 0 20px rgba(255, 122, 0, 0.3)',
        'glow-lg': '0 0 30px rgba(255, 122, 0, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(255, 122, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #FF7A00, #FF9433)',
        'gradient-dark': 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.9))',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
      aspectRatio: {
        '3/4': '3 / 4',
        '4/3': '4 / 3',
        '9/16': '9 / 16',
        '16/9': '16 / 9',
      },
    },
  },
  plugins: [],
}