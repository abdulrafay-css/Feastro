/**
 * Trending Section Component
 * Displays trending recipes with special styling
 */

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import RecipeCard from './RecipeCard';
import { RecipeCardSkeleton } from '../common/Skeleton';

const TrendingSection = ({ 
  recipes = [],
  loading = false,
  onRecipeClick,
  onLike,
  onSave,
  className = '',
  ...props 
}) => {
  // Loading State
  if (loading) {
    return (
      <div className={`w-full ${className}`} {...props}>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48">
              <RecipeCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Empty State
  if (!recipes || recipes.length === 0) {
    return null;
  }
  
  return (
    <motion.div 
      {...fadeInUp}
      className={`w-full ${className}`}
      {...props}
    >
      {/* Horizontal Scrolling Grid */}
      <motion.div 
        {...staggerContainer}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-2"
      >
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            className="flex-shrink-0 w-48 relative"
          >
            {/* Trending Badge */}
            {index < 3 && (
              <div className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {index + 1}
                </span>
              </div>
            )}
            
            {/* Recipe Card */}
            <RecipeCard
              recipe={recipe}
              onClick={() => onRecipeClick?.(recipe)}
              onLike={onLike}
              onSave={onSave}
            />
            
            {/* Trending Indicator */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white text-xs font-medium shadow-lg flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              Trending
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default TrendingSection;