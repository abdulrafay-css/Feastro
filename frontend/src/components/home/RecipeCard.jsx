import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoFlame, IoTime, IoStar } from 'react-icons/io5';
import { formatCookingTime } from '@utils/helpers';

/**
 * Recipe Card Component - Multiple variants
 */
export const RecipeCard = ({ recipe, variant = 'horizontal' }) => {
  if (variant === 'horizontal') {
    return (
      <Link to={`/recipe/${recipe.id}`}>
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 w-64 bg-dark-lighter rounded-3xl overflow-hidden border border-dark-light"
        >
          {/* Image */}
          <div className="relative aspect-square">
            {recipe.thumbnail_url ? (
              <img
                src={recipe.thumbnail_url}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-dark-light text-6xl">
                🍳
              </div>
            )}

            {/* Rating Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-dark bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full">
              <IoStar className="text-accent" size={14} />
              <span className="text-sm font-semibold">
                {(Math.random() * 0.5 + 4.5).toFixed(1)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-headline font-bold text-lg mb-2 line-clamp-2">
              {recipe.title}
            </h3>

            <div className="flex items-center gap-3 text-sm text-gray-light">
              <div className="flex items-center gap-1">
                <IoFlame size={16} className="text-primary" />
                <span>{recipe.calories || 520} kcal</span>
              </div>
              <div className="flex items-center gap-1">
                <IoTime size={16} />
                <span>{formatCookingTime(recipe.cooking_time)}</span>
              </div>
            </div>

            <button className="w-full mt-3 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-all">
              View Recipe →
            </button>
          </div>
        </motion.div>
      </Link>
    );
  }

  if (variant === 'large') {
    return (
      <Link to={`/recipe/${recipe.id}`}>
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="bg-dark-lighter rounded-3xl overflow-hidden border border-dark-light"
        >
          {/* Image */}
          <div className="relative aspect-video">
            {recipe.thumbnail_url ? (
              <img
                src={recipe.thumbnail_url}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-dark-light text-6xl">
                🍳
              </div>
            )}

            {/* Rating Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-dark bg-opacity-90 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <IoStar className="text-accent" size={16} />
              <span className="font-semibold">
                {(Math.random() * 0.5 + 4.5).toFixed(1)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-headline font-bold text-xl mb-2">
              {recipe.title}
            </h3>

            <div className="flex items-center gap-4 text-sm text-gray-light">
              <div className="flex items-center gap-1">
                <IoFlame size={18} className="text-primary" />
                <span>{recipe.calories || 520} kcal</span>
              </div>
              <div className="flex items-center gap-1">
                <IoTime size={18} />
                <span>{formatCookingTime(recipe.cooking_time)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return null;
};