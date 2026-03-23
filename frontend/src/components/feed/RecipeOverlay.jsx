/**
 * Recipe Overlay Component
 * Full recipe details overlay in feed
 */

import { motion } from 'framer-motion';
import { slideInBottom } from '../../utils/animations';
import { formatTime } from '../../utils/formatters';
import Badge from '../common/Badge';

const RecipeOverlay = ({ 
  recipe,
  onClose,
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      {...slideInBottom}
      className="absolute inset-0 z-20 bg-gradient-to-t from-black via-black/95 to-transparent overflow-y-auto"
      {...props}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="p-6 pt-16 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {recipe.title}
          </h1>
          
          {recipe.description && (
            <p className="text-white/80">
              {recipe.description}
            </p>
          )}
          
          {/* Meta Info */}
          <div className="flex flex-wrap gap-2 mt-4">
            {recipe.cooking_time && (
              <Badge text={`⏱️ ${formatTime(recipe.cooking_time)}`} />
            )}
            {recipe.difficulty && (
              <Badge text={recipe.difficulty} difficulty={recipe.difficulty} />
            )}
            {recipe.servings && (
              <Badge text={`🍽️ ${recipe.servings} servings`} />
            )}
          </div>
        </div>

        {/* Ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              📝 Ingredients
            </h2>
            <div className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 text-white/90"
                >
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                  </div>
                  <span>
                    {ingredient.amount && ingredient.unit && (
                      <span className="font-semibold text-orange-400">
                        {ingredient.amount} {ingredient.unit}{' '}
                      </span>
                    )}
                    {ingredient.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {recipe.instructions && recipe.instructions.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              📋 Instructions
            </h2>
            <div className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    {index + 1}
                  </div>
                  <p className="text-white/90 pt-1">
                    {step.text || step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {recipe.tips && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-orange-400 mb-2">
              💡 Chef's Tips
            </h3>
            <p className="text-white/90">
              {recipe.tips}
            </p>
          </div>
        )}

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-white/60 mb-2">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <Badge key={index} text={`#${tag}`} variant="default" size="sm" />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecipeOverlay;