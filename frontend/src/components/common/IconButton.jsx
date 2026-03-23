/**
 * Icon Button Component
 * Button with just an icon
 */

import { motion } from 'framer-motion';
import { hoverScale } from '../../utils/animations';

const IconButton = ({ 
  icon,
  onClick,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  
  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600',
    ghost: 'bg-transparent text-white/70 hover:bg-white/10 hover:text-white',
    outline: 'border border-white/20 text-white/70 hover:border-white/40 hover:text-white',
  };
  
  return (
    <motion.button
      {...hoverScale}
      onClick={onClick}
      className={`
        ${sizes[size]}
        ${variants[variant]}
        rounded-full flex items-center justify-center
        transition-all duration-200
        ${className}
      `}
      {...props}
    >
      {icon}
    </motion.button>
  );
};

export default IconButton;