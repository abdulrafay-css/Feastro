/**
 * Feed Modal Component
 * Full-screen TikTok-style video feed
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdrop } from '../../utils/animations';
import VideoCard from './VideoCard';
import FeedProgress from './FeedProgress';
import { FeedSkeleton } from '../common/Skeleton';

const FeedModal = ({ 
  isOpen,
  onClose,
  initialRecipes = [],
  initialIndex = 0,
  onLoadMore,
  className = '',
  ...props 
}) => {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowUp') {
        handlePrevious();
      } else if (e.key === 'ArrowDown') {
        handleNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, recipes.length]);

  // Navigate to next video
  const handleNext = useCallback(() => {
    if (currentIndex < recipes.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    } else if (onLoadMore) {
      // Load more recipes
      loadMoreRecipes();
    }
  }, [currentIndex, recipes.length, onLoadMore]);

  // Navigate to previous video
  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // Load more recipes
  const loadMoreRecipes = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const newRecipes = await onLoadMore?.();
      if (newRecipes && newRecipes.length > 0) {
        setRecipes(prev => [...prev, ...newRecipes]);
        setDirection(1);
        setCurrentIndex(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentRecipe = recipes[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            {...modalBackdrop}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[1040]"
          />
          
          {/* Feed Container */}
          <div className="fixed inset-0 z-[1050] overflow-hidden">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Close feed"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Progress Indicator */}
            <FeedProgress 
              current={currentIndex + 1}
              total={recipes.length}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-10"
            />

            {/* Video Cards */}
            {loading ? (
              <FeedSkeleton />
            ) : currentRecipe ? (
              <VideoCard
                recipe={currentRecipe}
                direction={direction}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isActive={true}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-white text-lg">No more recipes</p>
              </div>
            )}

            {/* Navigation Hints */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 text-white/50 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span>Swipe up</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span>Swipe down</span>
              </div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FeedModal;