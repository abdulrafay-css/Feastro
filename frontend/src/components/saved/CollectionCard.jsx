/**
 * Collection Card Component
 * Visual folder card for recipe collections
 */

import { motion } from 'framer-motion';
import { hoverLift, staggerItem } from '../../utils/animations';

const CollectionCard = ({ 
  collection,
  onClick,
  onDelete,
  className = '',
  ...props 
}) => {
  const {
    id,
    name,
    description,
    recipe_count = 0,
    cover_images = [],
    color = '#FF7A00',
  } = collection;

  // Show up to 4 recipe thumbnails in grid
  const displayImages = cover_images.slice(0, 4);

  return (
    <motion.div
      {...staggerItem}
      {...hoverLift}
      onClick={onClick}
      className={`group relative bg-bg-secondary rounded-xl overflow-hidden cursor-pointer ${className}`}
      {...props}
    >
      {/* Cover Images Grid */}
      <div className="relative aspect-square overflow-hidden">
        {displayImages.length > 0 ? (
          <div className={`grid ${displayImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-1 h-full`}>
            {displayImages.map((image, index) => (
              <div
                key={index}
                className="relative bg-bg-tertiary overflow-hidden"
              >
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)` }}
          >
            <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Recipe Count Badge */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-medium">
          {recipe_count} recipe{recipe_count !== 1 ? 's' : ''}
        </div>

        {/* Delete Button */}
        {onDelete && id !== 'all' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(collection);
            }}
            className="absolute top-2 left-2 w-8 h-8 bg-red-500/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}

        {/* Collection Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg line-clamp-1">
            {name}
          </h3>
          {description && (
            <p className="text-white/70 text-sm line-clamp-2 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Color Accent Bar */}
      <div 
        className="h-1 w-full"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
};

export default CollectionCard;