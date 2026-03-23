/**
 * Skeleton Loading Component
 * Loading placeholders with shimmer animation
 */

import { motion } from 'framer-motion';
import { shimmer } from '../../utils/animations';

const Skeleton = ({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  count = 1,
}) => {
  const baseClasses = 'bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] animate-shimmer';
  
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };
  
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;
  
  // Multiple skeletons
  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array(count).fill(0).map((_, i) => (
          <motion.div
            key={i}
            {...shimmer}
            className={`${baseClasses} ${variants[variant]} ${className}`}
            style={style}
          />
        ))}
      </div>
    );
  }
  
  return (
    <motion.div
      {...shimmer}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={style}
    />
  );
};

// Pre-made skeleton components
export const RecipeCardSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="aspect-[3/4] w-full" />
    <Skeleton variant="text" className="w-3/4" />
    <Skeleton variant="text" className="w-1/2" />
    <div className="flex gap-2 items-center">
      <Skeleton variant="circular" className="w-6 h-6" />
      <Skeleton variant="text" className="w-16" />
    </div>
  </div>
);

export const FeedSkeleton = () => (
  <div className="w-full h-screen bg-black/50 flex items-center justify-center">
    <motion.div 
      className="w-16 h-16 rounded-full border-4 border-white/20 border-t-orange-500"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton variant="circular" className="w-20 h-20" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
    </div>
  </div>
);

export default Skeleton;