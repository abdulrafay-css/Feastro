import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoHeart, IoBookmark, IoTime } from 'react-icons/io5';
import { Skeleton } from '@components/common/Loader';
import { formatNumber, formatCookingTime, timeAgo } from '@utils/helpers';
import { DIFFICULTY_COLORS } from '@utils/constants';

/**
 * Recipe Card for Grid Display
 */
const RecipeCard = ({ recipe }) => {
  return (
    <Link to={`/recipe/${recipe.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="bg-dark-lighter rounded-xl overflow-hidden border border-dark-light hover:border-primary transition-all cursor-pointer"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-dark-light">
          {recipe.thumbnail_url ? (
            <img
              src={recipe.thumbnail_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🍳
            </div>
          )}

          {/* Difficulty Badge */}
          <div className="absolute top-2 right-2">
            <span
              className={`px-3 py-1 bg-dark bg-opacity-80 backdrop-blur-sm rounded-full text-xs font-semibold capitalize ${
                DIFFICULTY_COLORS[recipe.difficulty]
              }`}
            >
              {recipe.difficulty}
            </span>
          </div>

          {/* Cooking Time */}
          <div className="absolute bottom-2 left-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-dark bg-opacity-80 backdrop-blur-sm rounded-full text-xs">
              <IoTime size={14} />
              <span>{formatCookingTime(recipe.cooking_time)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-headline font-bold text-lg mb-2 line-clamp-2">
            {recipe.title}
          </h3>

          {/* Author */}
          <p className="text-sm text-gray-light mb-3">
            by @{recipe.author_username}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-light">
            <div className="flex items-center gap-1">
              <IoHeart size={16} className="text-red-500" />
              <span>{formatNumber(recipe.likes_count)}</span>
            </div>
            <div className="flex items-center gap-1">
              <IoBookmark size={16} className="text-accent" />
              <span>{formatNumber(recipe.saves_count)}</span>
            </div>
            <span className="ml-auto">{timeAgo(recipe.created_at)}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

/**
 * Recipe Card Skeleton
 */
const RecipeCardSkeleton = () => {
  return (
    <div className="bg-dark-lighter rounded-xl overflow-hidden border border-dark-light">
      <Skeleton variant="thumbnail" />
      <div className="p-4 space-y-3">
        <Skeleton variant="title" />
        <Skeleton variant="text" className="w-1/2" />
        <div className="flex gap-4">
          <Skeleton variant="text" className="w-16" />
          <Skeleton variant="text" className="w-16" />
        </div>
      </div>
    </div>
  );
};

/**
 * Search Results Component
 */
export const SearchResults = ({ results, loading, error, emptyMessage }) => {
  // Loading state
  if (loading && !results.length) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <RecipeCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <h3 className="text-xl font-headline font-bold mb-2">Oops!</h3>
        <p className="text-gray-light text-center">{error}</p>
      </div>
    );
  }

  // Empty state
  if (!loading && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-headline font-bold mb-2">No Results Found</h3>
        <p className="text-gray-light text-center">
          {emptyMessage || 'Try adjusting your search or filters'}
        </p>
      </div>
    );
  }

  // Results
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* Loading more indicator */}
      {loading && results.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </>
  );
};