/**
 * Search Results Component
 * Display search results with loading and empty states
 */

import { motion } from 'framer-motion';
import { staggerContainer } from '../../utils/animations';
import RecipeGrid from '../home/RecipeGrid';
import { RecipeCardSkeleton } from '../common/Skeleton';

const SearchResults = ({ 
  results = [],
  query = '',
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
      <div className={`${className}`} {...props}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty State
  if (!loading && results.length === 0 && query) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
        {...props}
      >
        <div className="text-8xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-white mb-2">
          No results found
        </h3>
        <p className="text-white/60 text-center max-w-md mb-6">
          We couldn't find any recipes matching "{query}". Try adjusting your search or filters.
        </p>
        <div className="space-y-2 text-white/50 text-sm">
          <p>💡 Try searching for:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Specific ingredients (chicken, pasta, chocolate)</li>
            <li>Meal types (breakfast, lunch, dinner)</li>
            <li>Cuisines (Italian, Mexican, Asian)</li>
            <li>Cooking methods (grilled, baked, fried)</li>
          </ul>
        </div>
      </motion.div>
    );
  }

  // Results
  return (
    <div className={className} {...props}>
      {/* Results Count */}
      {query && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <p className="text-white/70">
            Found <span className="text-white font-semibold">{results.length}</span> recipe{results.length !== 1 ? 's' : ''} for "<span className="text-orange-400">{query}</span>"
          </p>
        </motion.div>
      )}

      {/* Recipe Grid */}
      <RecipeGrid
        recipes={results}
        loading={loading}
        onRecipeClick={onRecipeClick}
        onLike={onLike}
        onSave={onSave}
      />
    </div>
  );
};

export default SearchResults;