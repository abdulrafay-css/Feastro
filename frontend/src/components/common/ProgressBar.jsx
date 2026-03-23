/**
 * Progress Bar Component
 * Shows progress with animation
 */

import { motion } from 'framer-motion';
import { colors } from '../../utils/designTokens';

const ProgressBar = ({ 
  current,
  total,
  showLabel = false,
  size = 'md',
  className = '',
  ...props 
}) => {
  const percentage = Math.min((current / total) * 100, 100);
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  return (
    <div className={`relative ${className}`} {...props}>
      {/* Background Track */}
      <div className={`w-full bg-white/10 rounded-full overflow-hidden ${sizes[size]}`}>
        {/* Progress Fill */}
        <motion.div
          className="h-full rounded-full"
          style={{ background: colors.gradients.primary }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      
      {/* Label */}
      {showLabel && (
        <div className="mt-1 text-xs text-white/60 text-right">
          {current} / {total}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;