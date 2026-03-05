import { useState, useEffect } from 'react';
import { IoSearch, IoClose } from 'react-icons/io5';
import { useDebounce } from '@hooks/useDebounce';

/**
 * Search Bar Component
 */
export const SearchBar = ({ onSearch, placeholder = 'Search recipes...', autoFocus = false }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  /**
   * Clear search
   */
  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray">
        <IoSearch size={20} />
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-dark-light border border-dark-lighter text-white placeholder-gray rounded-full pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      />

      {/* Clear Button */}
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray hover:text-white transition-colors"
        >
          <IoClose size={20} />
        </button>
      )}
    </div>
  );
};