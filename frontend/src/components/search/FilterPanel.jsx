/**
 * Filter Panel Component
 * Advanced filters for search
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideInRight } from '../../utils/animations';
import Button from '../common/Button';
import Chip from '../common/Chip';

const FilterPanel = ({ 
  onApply,
  onClose,
  isOpen = false,
  className = '',
  ...props 
}) => {
  const [filters, setFilters] = useState({
    difficulty: [],
    cookingTime: null,
    dietary: [],
    cuisine: [],
  });

  const filterOptions = {
    difficulty: [
      { value: 'easy', label: 'Easy' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' },
    ],
    cookingTime: [
      { value: '15', label: 'Under 15 min' },
      { value: '30', label: 'Under 30 min' },
      { value: '60', label: 'Under 1 hour' },
      { value: '120', label: 'Over 1 hour' },
    ],
    dietary: [
      { value: 'vegetarian', label: '🌱 Vegetarian' },
      { value: 'vegan', label: '🥬 Vegan' },
      { value: 'gluten-free', label: '🌾 Gluten-Free' },
      { value: 'dairy-free', label: '🥛 Dairy-Free' },
      { value: 'keto', label: '🥑 Keto' },
      { value: 'paleo', label: '🥩 Paleo' },
    ],
    cuisine: [
      { value: 'italian', label: '🇮🇹 Italian' },
      { value: 'chinese', label: '🇨🇳 Chinese' },
      { value: 'mexican', label: '🇲🇽 Mexican' },
      { value: 'indian', label: '🇮🇳 Indian' },
      { value: 'japanese', label: '🇯🇵 Japanese' },
      { value: 'american', label: '🇺🇸 American' },
      { value: 'french', label: '🇫🇷 French' },
      { value: 'thai', label: '🇹🇭 Thai' },
    ],
  };

  const toggleFilter = (category, value) => {
    if (category === 'cookingTime') {
      setFilters(prev => ({
        ...prev,
        cookingTime: prev.cookingTime === value ? null : value,
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter(v => v !== value)
          : [...prev[category], value],
      }));
    }
  };

  const handleApply = () => {
    onApply?.(filters);
    onClose?.();
  };

  const handleClear = () => {
    setFilters({
      difficulty: [],
      cookingTime: null,
      dietary: [],
      cuisine: [],
    });
  };

  const activeFiltersCount = 
    filters.difficulty.length + 
    (filters.cookingTime ? 1 : 0) +
    filters.dietary.length + 
    filters.cuisine.length;

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
            className="fixed inset-0 bg-black/50 z-[1040]"
          />

          {/* Panel */}
          <motion.div
            {...slideInRight}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-bg-secondary border-l border-white/10 z-[1050] overflow-y-auto"
            {...props}
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Filters</h2>
                <button
                  onClick={onClose}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Difficulty */}
              <div>
                <h3 className="text-sm font-semibold text-white/80 mb-3">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.difficulty.map(option => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      selected={filters.difficulty.includes(option.value)}
                      onClick={() => toggleFilter('difficulty', option.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Cooking Time */}
              <div>
                <h3 className="text-sm font-semibold text-white/80 mb-3">Cooking Time</h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.cookingTime.map(option => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      selected={filters.cookingTime === option.value}
                      onClick={() => toggleFilter('cookingTime', option.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div>
                <h3 className="text-sm font-semibold text-white/80 mb-3">Dietary Restrictions</h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.dietary.map(option => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      selected={filters.dietary.includes(option.value)}
                      onClick={() => toggleFilter('dietary', option.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Cuisine */}
              <div>
                <h3 className="text-sm font-semibold text-white/80 mb-3">Cuisine</h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.cuisine.map(option => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      selected={filters.cuisine.includes(option.value)}
                      onClick={() => toggleFilter('cuisine', option.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Button
                  variant="ghost"
                  onClick={handleClear}
                  fullWidth
                  disabled={activeFiltersCount === 0}
                >
                  Clear All
                </Button>
                <Button
                  onClick={handleApply}
                  fullWidth
                >
                  Apply {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;