import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoFunnel, IoClose } from 'react-icons/io5';
import { Button } from '@components/common/Button';
import {
  DIFFICULTY_LEVELS,
  DIFFICULTY_LABELS,
  DIETARY_PREFERENCES,
  DIETARY_LABELS,
} from '@utils/constants';

/**
 * Filter Panel Component
 */
export const FilterPanel = ({ onApplyFilters, initialFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: initialFilters.difficulty || null,
    dietary_preference: initialFilters.dietary_preference || null,
    max_cooking_time: initialFilters.max_cooking_time || null,
    ingredient: initialFilters.ingredient || '',
  });

  /**
   * Handle filter change
   */
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * Apply filters
   */
  const handleApply = () => {
    // Remove null/empty values
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    onApplyFilters(activeFilters);
    setIsOpen(false);
  };

  /**
   * Reset filters
   */
  const handleReset = () => {
    setFilters({
      difficulty: null,
      dietary_preference: null,
      max_cooking_time: null,
      ingredient: '',
    });
  };

  /**
   * Count active filters
   */
  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== null && value !== ''
  ).length;

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-2 px-4 py-2 bg-dark-light hover:bg-dark-lighter rounded-full transition-colors"
      >
        <IoFunnel size={18} />
        <span className="font-medium">Filters</span>
        
        {activeFilterCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs font-bold">
            {activeFilterCount}
          </div>
        )}
      </button>

      {/* Filter Panel Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black bg-opacity-80"
            />

            {/* Panel */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative bg-dark-lighter rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-dark-light">
                <h2 className="text-2xl font-headline font-bold">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-dark-light rounded-lg transition-colors"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
                {/* Difficulty Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-headline font-semibold mb-3">Difficulty</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.values(DIFFICULTY_LEVELS).map((level) => (
                      <button
                        key={level}
                        onClick={() =>
                          handleFilterChange(
                            'difficulty',
                            filters.difficulty === level ? null : level
                          )
                        }
                        className={`py-3 px-4 rounded-lg font-medium transition-all ${
                          filters.difficulty === level
                            ? 'bg-primary text-white'
                            : 'bg-dark-light hover:bg-dark text-gray-light hover:text-white'
                        }`}
                      >
                        {DIFFICULTY_LABELS[level]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dietary Preference Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-headline font-semibold mb-3">
                    Dietary Preference
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(DIETARY_PREFERENCES)
                      .filter(([key]) => key !== 'NONE')
                      .map(([key, value]) => (
                        <button
                          key={value}
                          onClick={() =>
                            handleFilterChange(
                              'dietary_preference',
                              filters.dietary_preference === value ? null : value
                            )
                          }
                          className={`py-3 px-4 rounded-lg font-medium transition-all ${
                            filters.dietary_preference === value
                              ? 'bg-primary text-white'
                              : 'bg-dark-light hover:bg-dark text-gray-light hover:text-white'
                          }`}
                        >
                          {DIETARY_LABELS[value]}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Max Cooking Time Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-headline font-semibold mb-3">
                    Max Cooking Time
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {[15, 30, 60, 120].map((time) => (
                      <button
                        key={time}
                        onClick={() =>
                          handleFilterChange(
                            'max_cooking_time',
                            filters.max_cooking_time === time ? null : time
                          )
                        }
                        className={`py-3 px-4 rounded-lg font-medium transition-all ${
                          filters.max_cooking_time === time
                            ? 'bg-primary text-white'
                            : 'bg-dark-light hover:bg-dark text-gray-light hover:text-white'
                        }`}
                      >
                        {time < 60 ? `${time}m` : `${time / 60}h`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ingredient Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-headline font-semibold mb-3">
                    Specific Ingredient
                  </h3>
                  <input
                    type="text"
                    value={filters.ingredient}
                    onChange={(e) => handleFilterChange('ingredient', e.target.value)}
                    placeholder="e.g., chicken, tomato, pasta"
                    className="w-full bg-dark-light border border-dark-lighter text-white placeholder-gray rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-dark-light">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={handleReset}
                  disabled={activeFilterCount === 0}
                >
                  Reset
                </Button>
                <Button variant="primary" fullWidth onClick={handleApply}>
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};