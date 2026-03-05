import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoPeople, IoTime } from 'react-icons/io5';
import { formatCookingTime } from '@utils/helpers';

/**
 * Recipe Overlay Component - Slide-up panel with recipe details
 */
export const RecipeOverlay = ({ recipe, isOpen, onClose }) => {
  if (!recipe) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-60 z-40"
          />

          {/* Overlay Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="recipe-overlay fixed bottom-0 left-0 right-0 z-50"
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray rounded-full" />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-4 p-2 hover:bg-dark-light rounded-full transition-colors"
            >
              <IoClose size={24} />
            </button>

            {/* Content */}
            <div className="px-6 pb-8">
              {/* Recipe Header */}
              <div className="mb-6">
                <h2 className="text-3xl font-headline font-bold mb-3">
                  {recipe.title}
                </h2>
                
                {recipe.description && (
                  <p className="text-gray-light mb-4">{recipe.description}</p>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <IoTime className="text-primary" size={20} />
                    <span>{formatCookingTime(recipe.cooking_time)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <IoPeople className="text-primary" size={20} />
                    <span>{recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="px-3 py-1 bg-primary bg-opacity-20 rounded-full text-primary text-xs font-semibold capitalize">
                    {recipe.difficulty}
                  </div>
                </div>
              </div>

              {/* Ingredients Section */}
              <div className="mb-6">
                <h3 className="text-xl font-headline font-bold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🥗</span>
                  Ingredients
                </h3>
                
                <div className="space-y-2">
                  {recipe.ingredients?.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-dark-light rounded-lg"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-semibold">{ingredient.quantity}</span>
                        {ingredient.unit && <span className="ml-1">{ingredient.unit}</span>}
                        <span className="ml-2">{ingredient.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions Section */}
              <div className="mb-6">
                <h3 className="text-xl font-headline font-bold mb-3 flex items-center gap-2">
                  <span className="text-2xl">👨‍🍳</span>
                  Instructions
                </h3>
                
                <div className="space-y-4">
                  {recipe.instructions?.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center font-headline font-bold">
                        {step.step_number}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-gray-light leading-relaxed">
                          {step.instruction}
                        </p>
                        {step.duration && (
                          <p className="text-sm text-gray mt-1">
                            ⏱ {step.duration} minutes
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nutritional Info (if available) */}
              {(recipe.calories || recipe.protein || recipe.carbs || recipe.fat) && (
                <div className="mb-6">
                  <h3 className="text-xl font-headline font-bold mb-3 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Nutrition Facts
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {recipe.calories && (
                      <div className="p-4 bg-dark-light rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">
                          {recipe.calories}
                        </div>
                        <div className="text-sm text-gray-light">Calories</div>
                      </div>
                    )}
                    
                    {recipe.protein && (
                      <div className="p-4 bg-dark-light rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">
                          {recipe.protein}g
                        </div>
                        <div className="text-sm text-gray-light">Protein</div>
                      </div>
                    )}
                    
                    {recipe.carbs && (
                      <div className="p-4 bg-dark-light rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">
                          {recipe.carbs}g
                        </div>
                        <div className="text-sm text-gray-light">Carbs</div>
                      </div>
                    )}
                    
                    {recipe.fat && (
                      <div className="p-4 bg-dark-light rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">
                          {recipe.fat}g
                        </div>
                        <div className="text-sm text-gray-light">Fat</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-dark-light rounded-full text-sm text-gray-light"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};