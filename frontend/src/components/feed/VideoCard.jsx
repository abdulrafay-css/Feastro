/**
 * Video Card Component
 * Individual video with swipe gestures
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { swipeVariants, swipeConfidenceThreshold, swipePower } from '../../utils/animations';
import VideoPlayer from './VideoPlayer';
import EngagementButtons from './EngagementButtons';
import RecipeOverlay from './RecipeOverlay';
import Avatar from '../common/Avatar';

const VideoCard = ({ 
  recipe,
  direction,
  onNext,
  onPrevious,
  isActive = true,
  className = '',
  ...props 
}) => {
  const [showRecipe, setShowRecipe] = useState(false);

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.y, velocity.y);

    if (swipe < -swipeConfidenceThreshold) {
      // Swiped up - next video
      onNext?.();
    } else if (swipe > swipeConfidenceThreshold) {
      // Swiped down - previous video
      onPrevious?.();
    }
  };

  return (
    <motion.div
      custom={direction}
      variants={swipeVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        y: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      className={`absolute inset-0 ${className}`}
      {...props}
    >
      {/* Video Player */}
      <VideoPlayer
        src={recipe.video_url}
        poster={recipe.thumbnail}
        autoPlay={isActive}
        loop={true}
        muted={false}
      />

      {/* Top Gradient Overlay */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

      {/* Creator Info - Top */}
      <div className="absolute top-4 left-4 right-20 z-10">
        <div className="flex items-center gap-3">
          <Avatar
            src={recipe.creator?.avatar}
            alt={recipe.creator?.name}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold truncate">
              {recipe.creator?.name || 'Anonymous'}
            </p>
            <p className="text-white/70 text-sm">
              @{recipe.creator?.username || 'user'}
            </p>
          </div>
          <button className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-full hover:from-orange-600 hover:to-orange-700 transition-all">
            Follow
          </button>
        </div>
      </div>

      {/* Engagement Buttons - Right Side */}
      <EngagementButtons
        recipe={recipe}
        className="absolute right-4 bottom-24"
      />

      {/* Recipe Info - Bottom */}
      <div className="absolute bottom-0 left-0 right-20 p-4 z-10">
        <div className="space-y-2">
          {/* Title */}
          <h2 className="text-white font-bold text-lg line-clamp-2">
            {recipe.title}
          </h2>

          {/* Description */}
          {recipe.description && (
            <p className="text-white/80 text-sm line-clamp-2">
              {recipe.description}
            </p>
          )}

          {/* See Recipe Button */}
          <button
            onClick={() => setShowRecipe(true)}
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium text-sm transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            See Full Recipe
          </button>
        </div>
      </div>

      {/* Recipe Overlay */}
      <AnimatePresence>
        {showRecipe && (
          <RecipeOverlay
            recipe={recipe}
            onClose={() => setShowRecipe(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VideoCard;