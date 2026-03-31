/**
 * Category Navigation Component
 * Horizontal scrolling category filters
 */

import { motion } from 'framer-motion';
import { useState } from 'react';

const categories = [
  { id: 'all', label: 'All', icon: '🍽️' },
  { id: 'budget', label: 'Budget', icon: '💰' },
  { id: 'quick', label: 'Quick', icon: '⚡' },
  { id: 'spicy', label: 'Spicy', icon: '🌶️' },
  { id: 'healthy', label: 'Healthy', icon: '🥗' },
  { id: 'comfort', label: 'Comfort', icon: '🍲' },
  { id: 'protein', label: 'Protein', icon: '💪' },
  { id: 'late-night', label: 'Late Night', icon: '🌙' },
];

const CategoryNav = ({ 
  onCategoryChange,
  initialCategory = 'all',
  className = '',
  ...props 
}) => {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };
  
  return (
    <div className={`w-full ${className}`} {...props}>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3">
        {categories.map((category) => {
          const isActive = category.id === activeCategory;
          
          return (
            <motion.button
              key={category.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full
                text-sm font-medium whitespace-nowrap
                transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF9433] text-white shadow-lg shadow-orange-500/30' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNav;