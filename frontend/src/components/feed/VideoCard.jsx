import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useVideoPlayer } from '@hooks/useVideoPlayer';
import { recipeService } from '@services/recipeService';
import { EngagementButtons } from './EngagementButtons';
import { RecipeOverlay } from './RecipeOverlay';
import { CDN_URL } from '@utils/constants';

/**
 * Video Card Component - Individual video in the feed
 */
export const VideoCard = ({ recipe, isActive, onNext, onPrevious }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [viewLogged, setViewLogged] = useState(false);
  const watchStartTime = useRef(null);
  
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.7, // 70% of video must be visible
  });

  // Video player hook
  const {
    videoRef,
    isPlaying,
    togglePlay,
    currentTime,
    duration,
  } = useVideoPlayer({
    autoplay: isActive,
    muted: true,
    loop: true,
    onTimeUpdate: (current, total) => {
      // Log watch completion at 80%
      if (current / total > 0.8 && !viewLogged) {
        logWatchComplete(current, total);
      }
    },
  });

  // Auto-play when video comes into view and is active
  useEffect(() => {
    if (inView && isActive && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error('Autoplay failed:', err);
      });
    } else if (videoRef.current && !isActive) {
      videoRef.current.pause();
    }
  }, [inView, isActive, videoRef]);

  // Log view engagement when video becomes active
  useEffect(() => {
    if (isActive && !viewLogged) {
      watchStartTime.current = Date.now();
      logView();
    }
  }, [isActive, viewLogged]);

  /**
   * Log view engagement
   */
  const logView = async () => {
    try {
      await recipeService.logEngagement({
        recipe_id: recipe.id,
        engagement_type: 'view',
      });
      setViewLogged(true);
    } catch (error) {
      console.error('Failed to log view:', error);
    }
  };

  /**
   * Log watch completion
   */
  const logWatchComplete = async (current, total) => {
    try {
      const watchDuration = watchStartTime.current 
        ? (Date.now() - watchStartTime.current) / 1000 
        : current;
      
      await recipeService.logEngagement({
        recipe_id: recipe.id,
        engagement_type: 'watch_complete',
        watch_duration: watchDuration,
        watch_percentage: current / total,
      });
    } catch (error) {
      console.error('Failed to log watch complete:', error);
    }
  };

  /**
   * Handle video tap - toggle play/pause
   */
  const handleVideoTap = () => {
    togglePlay();
  };

  /**
   * Handle swipe gestures for navigation
   */
  const handleDragEnd = (event, info) => {
    const threshold = 50;
    
    if (info.offset.y < -threshold) {
      // Swiped up - show overlay
      setShowOverlay(true);
    } else if (info.offset.y > threshold && Math.abs(info.offset.x) < threshold) {
      // Swiped down - next video
      if (onNext) onNext();
    }
  };

  const videoUrl = recipe.video_url || `${CDN_URL}/videos/placeholder.mp4`;

  return (
    <div ref={inViewRef} className="relative w-full h-screen bg-black snap-start">
      {/* Video Player */}
      <motion.div
        className="absolute inset-0"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className="video-player"
          playsInline
          onClick={handleVideoTap}
        />

        {/* Play/Pause Indicator */}
        {!isPlaying && isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-black bg-opacity-50 rounded-full p-6">
              <svg
                className="w-16 h-16 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 overlay-gradient pointer-events-none" />

      {/* Recipe Info - Bottom Left */}
      <div className="absolute bottom-24 left-4 right-24 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-headline font-bold mb-2">
            {recipe.title}
          </h2>
          
          {recipe.author_username && (
            <p className="text-sm text-gray-light mb-2">
              by @{recipe.author_username}
            </p>
          )}
          
          <div className="flex items-center gap-3 text-sm text-gray-light">
            <span>🕐 {recipe.cooking_time} min</span>
            <span>•</span>
            <span className="capitalize">{recipe.difficulty}</span>
          </div>
        </motion.div>

        {/* Recipe Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => setShowOverlay(true)}
          className="mt-4 bg-primary hover:bg-primary-dark text-white font-headline font-semibold px-6 py-3 rounded-full transition-all active:scale-95 flex items-center gap-2"
        >
          <span>📖</span>
          View Recipe
        </motion.button>
      </div>

      {/* Engagement Buttons - Right Side */}
      <EngagementButtons
        recipe={recipe}
        onShareClick={() => {
          // Share handled in EngagementButtons
        }}
      />

      {/* Recipe Overlay Panel */}
      <RecipeOverlay
        recipe={recipe}
        isOpen={showOverlay}
        onClose={() => setShowOverlay(false)}
      />
    </div>
  );
};