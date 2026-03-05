import { motion } from 'framer-motion';

/**
 * Reusable Button component
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyles = 'font-headline font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 no-tap-highlight disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-dark-light hover:bg-dark-lighter text-white',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-primary hover:bg-opacity-10',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };
  
  const sizes = {
    small: 'py-2 px-4 text-sm',
    medium: 'py-3 px-6 text-base',
    large: 'py-4 px-8 text-lg',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {loading && (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {!loading && icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
};