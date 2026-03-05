import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoHeart, IoBookmark } from 'react-icons/io5';
import { Skeleton } from '@components/common/Loader';
import { formatNumber } from '@utils/helpers';

/**
 * Recipe Grid Item
 */
const RecipeGridItem = ({ recipe }) => {
  return (
    <Link to={`/recipe/${recipe.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative aspect-square bg-dark-light rounded-lg overflow-hidden cursor-pointer group"
      >
        {/* Thumbnail */}
        {recipe.thumbnail_url ? (
          <img
            src={recipe.thumbnail_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🍳
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="text-center">
            <h3 className="font-headline font-bold text-lg mb-2 px-4">
              {recipe.title}
            </h3>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <IoHeart className="text-red-500" />
                <span>{formatNumber(recipe.likes_count)}</span>
              </div>
              <div className="flex items-center gap-1">
                <IoBookmark className="text-accent" />
                <span>{formatNumber(recipe.saves_count)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

/**
 * Grid Item Skeleton
 */
const RecipeGridItemSkeleton = () => {
  return <Skeleton className="aspect-square rounded-lg" />;
};

/**
 * Recipe Grid Component
 */
export const RecipeGrid = ({ recipes, loading, error, emptyMessage }) => {
  // Loading state
  if (loading && !recipes.length) {
    return (
      <div className="grid grid-cols-3 gap-2 p-4">
        {[...Array(9)].map((_, index) => (
          <RecipeGridItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <p className="text-gray-light text-center">{error}</p>
      </div>
    );
  }

  // Empty state
  if (!loading && recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">🍳</div>
        <p className="text-gray-light text-center">
          {emptyMessage || 'No recipes yet'}
        </p>
      </div>
    );
  }

  // Grid
  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      {recipes.map((recipe) => (
        <RecipeGridItem key={recipe.id} recipe={recipe} />
      ))}

      {/* Loading more indicator */}
      {loading && recipes.length > 0 && (
        <div className="col-span-3 flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};