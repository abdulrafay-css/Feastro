/**
 * Enhanced Button Component
 * Supports multiple variants, sizes, loading states, and animations
 * 
 * Usage:
 * import Button from '@/components/common/Button';
 * 
 * <Button variant="primary" size="md" loading={isLoading} onClick={handleClick}>
 *   Save Recipe
 * </Button>
 */

import { motion } from 'framer-motion';
import { hoverScale } from '../../utils/animations';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  // Base styles
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed';
  
  // Variant styles
  const variants = {
    primary: `
      bg-gradient-to-r from-[#FF7A00] to-[#FF9433] 
      text-white shadow-lg shadow-orange-500/30 
      hover:shadow-orange-500/50 
      disabled:opacity-50 disabled:shadow-none
    `,
    secondary: `
      bg-white/10 text-white border border-white/20 
      hover:bg-white/20 hover:border-white/30
      disabled:opacity-50 disabled:hover:bg-white/10
    `,
    ghost: `
      bg-transparent text-white 
      hover:bg-white/10
      disabled:opacity-50 disabled:hover:bg-transparent
    `,
    danger: `
      bg-red-500 text-white shadow-lg shadow-red-500/30
      hover:bg-red-600 hover:shadow-red-500/50
      disabled:opacity-50 disabled:shadow-none
    `,
    success: `
      bg-green-500 text-white shadow-lg shadow-green-500/30
      hover:bg-green-600 hover:shadow-green-500/50
      disabled:opacity-50 disabled:shadow-none
    `,
    outline: `
      bg-transparent text-[#FF7A00] border-2 border-[#FF7A00]
      hover:bg-[#FF7A00] hover:text-white
      disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#FF7A00]
    `,
  };
  
  // Size styles
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };
  
  const isDisabled = disabled || loading;
  
  return (
    <motion.button
      {...(!isDisabled && hoverScale)}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      type={type}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <svg 
          className="animate-spin h-5 w-5" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {/* Icon (Left) */}
      {!loading && icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      
      {/* Button Text */}
      {loading ? 'Loading...' : children}
      
      {/* Icon (Right) */}
      {!loading && icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </motion.button>
  );
};

export default Button;