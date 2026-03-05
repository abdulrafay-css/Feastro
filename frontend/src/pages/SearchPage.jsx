import { useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { SearchBar } from '@components/search/SearchBar';
import { FilterPanel } from '@components/search/FilterPanel';
import { SearchResults } from '@components/search/SearchResults';
import { useAuth } from '@hooks/useAuth';
import { useInfiniteScroll } from '@hooks/useInfiniteScroll';
import { recipeService } from '@services/recipeService';
import { Loader } from '@components/common/Loader';

/**
 * Search Page
 */
export const SearchPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [activeSearch, setActiveSearch] = useState(false);

  // Fetch function for search results
  const fetchSearchResults = useCallback(
    async (page, pageSize) => {
      const searchFilters = {
        query: searchQuery,
        ...filters,
      };

      const response = await recipeService.searchRecipes(searchFilters, page, pageSize);
      return response;
    },
    [searchQuery, filters]
  );

  // Infinite scroll hook
  const {
    data: recipes,
    loading,
    error,
    hasMore,
    refresh,
    observerRef,
  } = useInfiniteScroll(fetchSearchResults, {
    pageSize: 20,
    enabled: activeSearch,
  });

  /**
   * Handle search query change
   */
  const handleSearch = (query) => {
    setSearchQuery(query);
    setActiveSearch(!!query || Object.keys(filters).length > 0);
    refresh();
  };

  /**
   * Handle filter apply
   */
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setActiveSearch(!!searchQuery || Object.keys(newFilters).length > 0);
    refresh();
  };

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
      {/* Search Header */}
      <div className="sticky top-0 bg-dark-lighter border-b border-dark-light z-10 safe-top">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search recipes, ingredients..."
                autoFocus
              />
            </div>
            <FilterPanel
              onApplyFilters={handleApplyFilters}
              initialFilters={filters}
            />
          </div>

          {/* Active Filters Display */}
          {Object.keys(filters).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => (
                <div
                  key={key}
                  className="px-3 py-1 bg-primary bg-opacity-20 text-primary rounded-full text-sm flex items-center gap-2"
                >
                  <span className="capitalize">
                    {key.replace('_', ' ')}: {value}
                  </span>
                  <button
                    onClick={() => {
                      const newFilters = { ...filters };
                      delete newFilters[key];
                      handleApplyFilters(newFilters);
                    }}
                    className="hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {!activeSearch ? (
          // Trending/Suggestions when no search
          <TrendingSection />
        ) : (
          // Search Results
          <>
            <SearchResults
              results={recipes}
              loading={loading}
              error={error}
              emptyMessage="No recipes found. Try different keywords or filters."
            />

            {/* Infinite Scroll Observer */}
            {hasMore && <div ref={observerRef} className="h-20" />}
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Trending Section Component
 */
const TrendingSection = () => {
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch trending recipes
  useState(() => {
    const fetchTrending = async () => {
      try {
        const recipes = await recipeService.getTrendingRecipes(12);
        setTrendingRecipes(recipes);
      } catch (error) {
        console.error('Failed to fetch trending:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-headline font-bold mb-6">
        🔥 Trending Recipes
      </h2>

      <SearchResults
        results={trendingRecipes}
        loading={loading}
        emptyMessage="No trending recipes available"
      />
    </div>
  );
};