import { useState, useRef, useCallback, useEffect } from 'react';
import { VideoCard } from './VideoCard';
import { Loader } from '@components/common/Loader';
import { useInfiniteScroll } from '@hooks/useInfiniteScroll';
import { recipeService } from '@services/recipeService';
import { useAuth } from '@hooks/useAuth';

/**
 * Feed Container Component - TikTok-style vertical scrolling feed
 */
export const FeedContainer = ({ feedType = 'discover' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const { isAuthenticated } = useAuth();

  // Fetch function based on feed type
  const fetchFeed = useCallback(
    async (page, pageSize) => {
      if (feedType === 'personalized' && isAuthenticated) {
        return await recipeService.getPersonalizedFeed(page, pageSize);
      } else {
        return await recipeService.getFeed(page, pageSize);
      }
    },
    [feedType, isAuthenticated]
  );

  // Infinite scroll hook
  const {
    data: recipes,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  } = useInfiniteScroll(fetchFeed, {
    pageSize: 10,
    enabled: true,
  });

  /**
   * Handle scroll - Update active video index
   */
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const windowHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / windowHeight);

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }

    // Load more when approaching end
    if (
      scrollTop + windowHeight >= containerRef.current.scrollHeight - windowHeight * 2 &&
      hasMore &&
      !loading
    ) {
      loadMore();
    }
  }, [activeIndex, hasMore, loading, loadMore]);

  /**
   * Throttled scroll handler
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timeout;
    const throttledScroll = () => {
      if (timeout) return;
      timeout = setTimeout(() => {
        handleScroll();
        timeout = null;
      }, 100);
    };

    container.addEventListener('scroll', throttledScroll);
    return () => container.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  /**
   * Navigate to next video
   */
  const goToNext = useCallback(() => {
    if (!containerRef.current) return;
    
    const nextIndex = Math.min(activeIndex + 1, recipes.length - 1);
    containerRef.current.scrollTo({
      top: nextIndex * window.innerHeight,
      behavior: 'smooth',
    });
  }, [activeIndex, recipes.length]);

  /**
   * Navigate to previous video
   */
  const goToPrevious = useCallback(() => {
    if (!containerRef.current) return;
    
    const prevIndex = Math.max(activeIndex - 1, 0);
    containerRef.current.scrollTo({
      top: prevIndex * window.innerHeight,
      behavior: 'smooth',
    });
  }, [activeIndex]);

  // Error state
  if (error && recipes.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-headline font-bold mb-2">Oops!</h2>
        <p className="text-gray-light text-center mb-6">{error}</p>
        <button
          onClick={refresh}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (!loading && recipes.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-4">🍳</div>
        <h2 className="text-2xl font-headline font-bold mb-2">No Recipes Yet</h2>
        <p className="text-gray-light text-center mb-6">
          Be the first to share a delicious recipe!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      {recipes.map((recipe, index) => (
        <VideoCard
          key={recipe.id}
          recipe={recipe}
          isActive={index === activeIndex}
          onNext={goToNext}
          onPrevious={goToPrevious}
        />
      ))}

      {/* Loading indicator at the end */}
      {loading && recipes.length > 0 && (
        <div className="h-screen flex items-center justify-center snap-start">
          <Loader size="large" />
        </div>
      )}

      {/* End of feed message */}
      {!hasMore && recipes.length > 0 && (
        <div className="h-screen flex flex-col items-center justify-center snap-start px-4">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-headline font-bold mb-2">
            You're All Caught Up!
          </h2>
          <p className="text-gray-light text-center mb-6">
            You've seen all the recipes. Check back later for more!
          </p>
          <button
            onClick={refresh}
            className="btn-primary"
          >
            Refresh Feed
          </button>
        </div>
      )}
    </div>
  );
};