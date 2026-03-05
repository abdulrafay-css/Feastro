import { useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { SearchResults } from '@components/search/SearchResults';
import { useAuth } from '@hooks/useAuth';
import { useInfiniteScroll } from '@hooks/useInfiniteScroll';
import { recipeService } from '@services/recipeService';
import { Loader } from '@components/common/Loader';

/**
 * Saved Page - User's saved recipes
 */
export const SavedPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Fetch saved recipes
  const fetchSavedRecipes = useCallback(async (page, pageSize) => {
    return await recipeService.getSavedRecipes(page, pageSize);
  }, []);

  // Infinite scroll hook
  const {
    data: savedRecipes,
    loading,
    error,
    hasMore,
    refresh,
    observerRef,
  } = useInfiniteScroll(fetchSavedRecipes, {
    pageSize: 20,
    enabled: isAuthenticated,
  });

  // Auth loading state
  if (authLoading) {
    return <Loader fullScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="sticky top-0 bg-dark-lighter border-b border-dark-light z-10 safe-top">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-headline font-bold">
              💾 Saved Recipes
            </h1>
            
            {savedRecipes.length > 0 && (
              <button
                onClick={refresh}
                className="text-primary hover:text-primary-light transition-colors font-medium"
              >
                Refresh
              </button>
            )}
          </div>
          
          {savedRecipes.length > 0 && (
            <p className="text-gray-light mt-2">
              {savedRecipes.length} recipe{savedRecipes.length !== 1 ? 's' : ''} saved
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <SearchResults
          results={savedRecipes}
          loading={loading}
          error={error}
          emptyMessage="No saved recipes yet. Start saving your favorite recipes!"
        />

        {/* Infinite Scroll Observer */}
        {hasMore && <div ref={observerRef} className="h-20" />}
      </div>
    </div>
  );
};