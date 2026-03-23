/**
 * Recipe Grid Component
 * Responsive grid layout for recipe cards
 */

import { motion } from 'framer-motion';
import { staggerContainer } from '../../utils/animations';
import RecipeCard from './RecipeCard';
import { RecipeCardSkeleton } from '../common/Skeleton';

const RecipeGrid = ({ 
  recipes = [],
  loading = false,
  onRecipeClick,
  onLike,
  onSave,
  columns = { sm: 2, md: 3, lg: 4 },
  gap = 4,
  className = '',
  ...props 
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
  };
  
  const gridClass = `
    grid
    ${gridCols[columns.sm] || 'grid-cols-2'}
    md:${gridCols[columns.md] || 'grid-cols-3'}
    lg:${gridCols[columns.lg] || 'grid-cols-4'}
    gap-${gap}
  `;
  
  // Loading State
  if (loading) {
    return (
      <div className={`${gridClass} ${className}`} {...props}>
        {Array(8).fill(0).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  
  // Empty State
  if (!recipes || recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-6xl mb-4">🍳</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No recipes found
        </h3>
        <p className="text-white/60 text-center">
          Try adjusting your filters or check back later for new recipes
        </p>
      </div>
    );
  }
  
  return (
    <motion.div 
      {...staggerContainer}
      className={`${gridClass} ${className}`}
      {...props}
    >
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={() => onRecipeClick?.(recipe)}
          onLike={onLike}
          onSave={onSave}
        />
      ))}
    </motion.div>
  );
};

export default RecipeGrid;