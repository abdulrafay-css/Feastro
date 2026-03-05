import { motion } from 'framer-motion';

/**
 * Category Chips Component
 */
export const CategoryChips = ({ categories, selected, onSelect }) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(category.id)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
            selected === category.id
              ? 'bg-primary text-white'
              : 'bg-dark-light text-gray-light hover:bg-dark hover:text-white'
          }`}
        >
          {category.icon && <span>{category.icon}</span>}
          {category.label}
        </motion.button>
      ))}
    </div>
  );
};