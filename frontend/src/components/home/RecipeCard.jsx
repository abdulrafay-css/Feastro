/**
 * Recipe Card Component
 * Main recipe display card with image, info, and engagement
 */

import { motion } from 'framer-motion';
import { hoverLift, staggerItem } from '../../utils/animations';
import { formatNumber, formatTime, getDifficultyColor } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

const RecipeCard = ({ 
  recipe,
  onClick,
  onLike,
  onSave,
  className = '',
  ...props 
}) => {
  const { showToast } = useToast();
  
  const {
    id,
    title,
    thumbnail,
    creator,
    likes_count = 0,
    saves_count = 0,
    views_count = 0,
    cooking_time,
    difficulty,
    is_liked = false,
    is_saved = false,
  } = recipe;

  const handleLike = (e) => {
    e.stopPropagation();
    onLike?.(recipe);
    showToast(is_liked ? 'Removed from likes' : 'Recipe liked! ❤️', 'success');
  };
  
  const handleSave = (e) => {
    e.stopPropagation();
    onSave?.(recipe);
    showToast(is_saved ? 'Removed from saved' : 'Recipe saved! 🔖', 'success');
  };

  return (
    <motion.div
      {...staggerItem}
      {...hoverLift}
      onClick={onClick}
      className={`group relative bg-bg-secondary rounded-xl overflow-hidden cursor-pointer ${className}`}
      {...props}
    >
      {/* Recipe Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={thumbnail || '/placeholder-recipe.jpg'} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start gap-2">
          {/* Time Badge */}
          {cooking_time && (
            <Badge 
              text={`⏱️ ${formatTime(cooking_time)}`}
              className="bg-black/60 backdrop-blur-md"
            />
          )}
          
          {/* Difficulty Badge */}
          {difficulty && (
            <Badge 
              text={difficulty}
              difficulty={difficulty}
            />
          )}
        </div>
        
        {/* Saved Indicator */}
        {is_saved && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </motion.div>
        )}
        
        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
          {/* Title */}
          <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight">
            {title}
          </h3>
          
          {/* Creator Info */}
          <div className="flex items-center gap-2">
            <Avatar 
              src={creator?.avatar} 
              alt={creator?.name || 'Creator'}
              size="sm"
            />
            <span className="text-white/80 text-xs truncate">
              {creator?.name || 'Anonymous'}
            </span>
          </div>
          
          {/* Engagement Stats */}
          <div className="flex items-center gap-3 text-white/70 text-xs">
            {/* Like Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${
                is_liked ? 'text-red-500' : 'hover:text-red-400'
              }`}
            >
              <svg 
                className="w-4 h-4" 
                fill={is_liked ? 'currentColor' : 'none'}
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
              <span>{formatNumber(likes_count)}</span>
            </motion.button>
            
            {/* Save Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSave}
              className={`flex items-center gap-1 transition-colors ${
                is_saved ? 'text-orange-500' : 'hover:text-orange-400'
              }`}
            >
              <svg 
                className="w-4 h-4" 
                fill={is_saved ? 'currentColor' : 'none'}
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                />
              </svg>
              <span>{formatNumber(saves_count)}</span>
            </motion.button>
            
            {/* Views */}
            {views_count > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{formatNumber(views_count)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;