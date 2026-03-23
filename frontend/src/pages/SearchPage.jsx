/**
 * Search Page
 * Search with filters and results
 */

import { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/search/FilterPanel';
import FilterChips from '../components/search/FilterChips';
import SearchResults from '../components/search/SearchResults';
import SortDropdown from '../components/search/SortDropdown';
import IconButton from '../components/common/IconButton';
import FeedModal from '../components/feed/FeedModal';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: [],
    cookingTime: null,
    dietary: [],
    cuisine: [],
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [feedModalOpen, setFeedModalOpen] = useState(false);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0);

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockResults = Array(8).fill(0).map((_, i) => ({
        id: `search-${i}`,
        title: `${searchQuery} Recipe ${i + 1}`,
        thumbnail: `https://picsum.photos/seed/search${i}/400/600`,
        creator: {
          name: `Chef ${i + 1}`,
          username: `chef${i + 1}`,
          avatar: `https://i.pravatar.cc/150?img=${i + 40}`,
        },
        cooking_time: 30,
        difficulty: ['easy', 'medium', 'hard'][i % 3],
        likes_count: 1000 + (i * 100),
        saves_count: 500 + (i * 50),
        views_count: 5000,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      }));
      setResults(mockResults);
      setLoading(false);
    }, 800);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    // Re-search with filters
    if (query) {
      handleSearch(query);
    }
  };

  const handleRemoveFilter = (category, value) => {
    const newFilters = { ...filters };
    if (category === 'cookingTime') {
      newFilters.cookingTime = null;
    } else {
      newFilters[category] = newFilters[category].filter(v => v !== value);
    }
    setFilters(newFilters);
    handleApplyFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    const emptyFilters = {
      difficulty: [],
      cookingTime: null,
      dietary: [],
      cuisine: [],
    };
    setFilters(emptyFilters);
    handleApplyFilters(emptyFilters);
  };

  const handleSort = (newSortBy) => {
    setSortBy(newSortBy);
    // Re-sort results
    console.log('Sorting by:', newSortBy);
  };

  const handleRecipeClick = (recipe) => {
    const index = results.findIndex(r => r.id === recipe.id);
    setSelectedRecipeIndex(index);
    setFeedModalOpen(true);
  };

  return (
    <PageLayout
      title="Search"
      headerActions={
        <IconButton
          variant="ghost"
          onClick={() => setShowFilters(true)}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          }
        />
      }
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          onClear={() => {
            setQuery('');
            setResults([]);
          }}
        />

        {/* Active Filters */}
        <FilterChips
          filters={filters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />

        {/* Sort & Results Count */}
        {results.length > 0 && (
          <div className="flex justify-between items-center">
            <p className="text-white/70 text-sm">
              {results.length} results
            </p>
            <SortDropdown
              onSort={handleSort}
              defaultSort={sortBy}
            />
          </div>
        )}

        {/* Search Results */}
        <SearchResults
          results={results}
          query={query}
          loading={loading}
          onRecipeClick={handleRecipeClick}
        />
      </div>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
      />

      {/* Feed Modal */}
      <FeedModal
        isOpen={feedModalOpen}
        onClose={() => setFeedModalOpen(false)}
        initialRecipes={results}
        initialIndex={selectedRecipeIndex}
      />
    </PageLayout>
  );
};

export default SearchPage;