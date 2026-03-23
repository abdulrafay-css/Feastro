/**
 * Card Component
 * Container for content with consistent styling
 */

import { motion } from 'framer-motion';
import { hoverLift } from '../../utils/animations';

const Card = ({ 
  children,
  title,
  subtitle,
  className = '',
  onClick,
  hover = false,
  padding = 'normal',
  ...props 
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    normal: 'p-4',
    lg: 'p-6',
  };
  
  const Component = onClick || hover ? motion.div : 'div';
  const motionProps = onClick || hover ? hoverLift : {};
  
  return (
    <Component
      {...(onClick || hover ? motionProps : {})}
      onClick={onClick}
      className={`
        bg-bg-secondary rounded-xl border border-white/5
        ${onClick ? 'cursor-pointer' : ''}
        ${paddings[padding]}
        ${className}
      `}
      {...props}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-white/60 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      
      {/* Content */}
      {children}
    </Component>
  );
};

export default Card;