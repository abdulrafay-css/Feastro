/**
 * Filter Chips Component
 * Display active filters as removable chips
 */

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../utils/animations';
import Chip from '../common/Chip';

const FilterChips = ({ 
  filters = {},
  onRemove,
  onClearAll,
  className = '',
  ...props 
}) => {
  const filterLabels = {
    difficulty: {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
    },
    cookingTime: {
      '15': 'Under 15 min',
      '30': 'Under 30 min',
      '60': 'Under 1 hour',
      '120': 'Over 1 hour',
    },
    dietary: {
      vegetarian: '🌱 Vegetarian',
      vegan: '🥬 Vegan',
      'gluten-free': '🌾 Gluten-Free',
      'dairy-free': '🥛 Dairy-Free',
      keto: '🥑 Keto',
      paleo: '🥩 Paleo',
    },
    cuisine: {
      italian: '🇮🇹 Italian',
      chinese: '🇨🇳 Chinese',
      mexican: '🇲🇽 Mexican',
      indian: '🇮🇳 Indian',
      japanese: '🇯🇵 Japanese',
      american: '🇺🇸 American',
      french: '🇫🇷 French',
      thai: '🇹🇭 Thai',
    },
  };

  // Convert filters object to chip array
  const activeFilters = [];
  
  Object.entries(filters).forEach(([category, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => {
        activeFilters.push({
          category,
          value: v,
          label: filterLabels[category]?.[v] || v,
        });
      });
    } else if (value) {
      activeFilters.push({
        category,
        value,
        label: filterLabels[category]?.[value] || value,
      });
    }
  });

  if (activeFilters.length === 0) return null;

  return (
    <motion.div 
      {...staggerContainer}
      className={`flex flex-wrap items-center gap-2 ${className}`}
      {...props}
    >
      {/* Active Filter Chips */}
      {activeFilters.map((filter, index) => (
        <motion.div key={`${filter.category}-${filter.value}`} {...staggerItem}>
          <Chip
            label={filter.label}
            selected={true}
            onDelete={() => onRemove?.(filter.category, filter.value)}
          />
        </motion.div>
      ))}

      {/* Clear All Button */}
      {activeFilters.length > 1 && (
        <motion.div {...staggerItem}>
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            Clear all
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FilterChips;