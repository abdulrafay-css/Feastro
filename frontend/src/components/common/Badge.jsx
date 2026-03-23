/**
 * Badge Component
 * Displays status, difficulty, tags, etc.
 */

import { getDifficultyColor } from '../../utils/formatters';

const Badge = ({ 
  text,
  variant = 'default',
  difficulty,
  size = 'md',
  className = '',
  ...props 
}) => {
  // Get color for difficulty badges
  const getDifficultyStyles = () => {
    const color = getDifficultyColor(difficulty);
    return {
      backgroundColor: `${color}20`,
      color: color,
    };
  };
  
  // Size styles
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };
  
  // Variant styles
  const variants = {
    default: 'bg-white/10 text-white/80',
    primary: 'bg-orange-500/20 text-orange-400',
    success: 'bg-green-500/20 text-green-400',
    error: 'bg-red-500/20 text-red-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    info: 'bg-blue-500/20 text-blue-400',
  };
  
  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium backdrop-blur-md
        ${sizes[size]}
        ${difficulty ? '' : variants[variant]}
        ${className}
      `}
      style={difficulty ? getDifficultyStyles() : undefined}
      {...props}
    >
      {text}
    </span>
  );
};

export default Badge;