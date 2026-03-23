/**
 * Personalized Section Component
 * Section header for "For You", "Trending", etc.
 */

import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';

const PersonalizedSection = ({ 
  title,
  subtitle,
  icon,
  action,
  actionLabel = 'View All',
  onActionClick,
  children,
  className = '',
  ...props 
}) => {
  return (
    <motion.div 
      {...fadeInUp}
      className={`w-full ${className}`} 
      {...props}
    >
      {/* Section Header */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between">
          {/* Title & Subtitle */}
          <div className="flex items-center gap-3">
            {icon && (
              <div className="text-3xl">
                {icon}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-white">
                {title}
              </h2>
              {subtitle && (
                <p className="text-white/60 text-sm mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {/* Action Button */}
          {(action || onActionClick) && (
            <button
              onClick={onActionClick}
              className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
            >
              {actionLabel} →
            </button>
          )}
        </div>
      </div>
      
      {/* Section Content */}
      {children}
    </motion.div>
  );
};

export default PersonalizedSection;