/**
 * Search Bar Component
 * Search input with autocomplete and suggestions
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scaleIn } from '../../utils/animations';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = ({ 
  onSearch,
  onClear,
  placeholder = 'Search recipes...',
  showSuggestions = true,
  className = '',
  ...props 
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const searchRef = useRef(null);
  
  // Debounce search query
  const debouncedQuery = useDebounce(query, 300);

  // Mock suggestions (replace with API call)
  const mockSuggestions = [
    'Pasta Carbonara',
    'Chocolate Cake',
    'Chicken Curry',
    'Vegan Tacos',
    'Beef Stir Fry',
    'Caesar Salad',
    'Sushi Rolls',
    'Pizza Margherita',
  ];

  useEffect(() => {
    if (debouncedQuery.length > 2 && showSuggestions) {
      // Filter mock suggestions
      const filtered = mockSuggestions.filter(s => 
        s.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    // Trigger search when debounced query changes
    if (debouncedQuery) {
      onSearch?.(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    onClear?.();
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    setIsFocused(false);
    onSearch?.(suggestion);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else if (query) {
        setSuggestions([]);
        setIsFocused(false);
        onSearch?.(query);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setSuggestions([]);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`} {...props}>
      {/* Search Input */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full pl-12 pr-12 py-3 
            bg-white/5 border rounded-lg
            ${isFocused ? 'border-orange-500 bg-white/10' : 'border-white/10'}
            text-white placeholder-white/40
            focus:outline-none
            transition-all duration-200
          `}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            {...scaleIn}
            className="absolute z-10 w-full mt-2 bg-bg-tertiary border border-white/10 rounded-lg shadow-xl overflow-hidden"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`
                  w-full px-4 py-3 text-left flex items-center gap-3
                  transition-colors
                  ${index === selectedIndex 
                    ? 'bg-orange-500/20 text-orange-400' 
                    : 'text-white/80 hover:bg-white/5'
                  }
                `}
              >
                <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>{suggestion}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Searches (when focused and no query) */}
      {/* This can be implemented later with localStorage */}
    </div>
  );
};

export default SearchBar;