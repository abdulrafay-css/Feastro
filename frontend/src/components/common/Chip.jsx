/**
 * Chip Component
 * Selectable filter chips
 */

import { motion } from 'framer-motion';
import { hoverScale } from '../../utils/animations';

const Chip = ({ 
  label,
  selected = false,
  onClick,
  onDelete,
  icon,
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  
  return (
    <motion.button
      {...hoverScale}
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 rounded-full font-medium
        transition-all duration-200
        ${sizes[size]}
        ${selected 
          ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF9433] text-white shadow-lg' 
          : 'bg-white/10 text-white/70 hover:bg-white/20'
        }
        ${className}
      `}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex-shrink-0 hover:text-white/50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.button>
  );
};

export default Chip;