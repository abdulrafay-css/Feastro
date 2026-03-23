/**
 * Sort Dropdown Component
 * Sort search results by different criteria
 */

import { useState } from 'react';
import Dropdown from '../common/Dropdown';

const SortDropdown = ({ 
  onSort,
  defaultSort = 'relevance',
  className = '',
  ...props 
}) => {
  const [sortBy, setSortBy] = useState(defaultSort);

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'quickest', label: 'Quickest to Make' },
    { value: 'easiest', label: 'Easiest First' },
  ];

  const handleSortChange = (value) => {
    setSortBy(value);
    onSort?.(value);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`} {...props}>
      <span className="text-sm text-white/70 whitespace-nowrap">Sort by:</span>
      <Dropdown
        options={sortOptions}
        value={sortBy}
        onChange={handleSortChange}
        className="min-w-[180px]"
      />
    </div>
  );
};

export default SortDropdown;