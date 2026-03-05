import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for infinite scroll pagination
 */
export const useInfiniteScroll = (fetchFunction, options = {}) => {
  const {
    initialPage = 1,
    pageSize = 10,
    threshold = 0.8, // Trigger when 80% scrolled
    enabled = true,
  } = options;

  const [data, setData] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const loadingRef = useRef(false);

  /**
   * Fetch data for current page
   */
  const fetchData = useCallback(async () => {
    if (loadingRef.current || !hasMore || !enabled) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(page, pageSize);
      
      // Handle different response formats
      let newData = [];
      let hasMoreData = true;

      if (Array.isArray(result)) {
        newData = result;
        hasMoreData = result.length === pageSize;
      } else if (result.recipes) {
        newData = result.recipes;
        hasMoreData = result.has_more || false;
      } else if (result.users) {
        newData = result.users;
        hasMoreData = result.has_more || false;
      }

      setData((prev) => {
        // Avoid duplicates
        const newItems = newData.filter(
          (item) => !prev.some((existingItem) => existingItem.id === item.id)
        );
        return [...prev, ...newItems];
      });

      setHasMore(hasMoreData);
      
      if (hasMoreData) {
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      console.error('Infinite scroll error:', err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [page, pageSize, hasMore, enabled, fetchFunction]);

  /**
   * Reset pagination
   */
  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
    loadingRef.current = false;
  }, [initialPage]);

  /**
   * Refresh data (reset and fetch)
   */
  const refresh = useCallback(async () => {
    reset();
    // Wait for reset to complete
    setTimeout(() => {
      setPage(initialPage);
    }, 0);
  }, [reset, initialPage]);

  /**
   * Load more data manually
   */
  const loadMore = useCallback(() => {
    if (!loading && hasMore && enabled) {
      fetchData();
    }
  }, [loading, hasMore, enabled, fetchData]);

  /**
   * Intersection Observer callback
   */
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && hasMore && enabled) {
        fetchData();
      }
    },
    [loading, hasMore, enabled, fetchData]
  );

  /**
   * Set up intersection observer
   */
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [handleObserver, threshold]);

  /**
   * Initial fetch
   */
  useEffect(() => {
    if (enabled && data.length === 0 && page === initialPage) {
      fetchData();
    }
  }, [enabled, data.length, page, initialPage, fetchData]);

  return {
    data,
    loading,
    error,
    hasMore,
    page,
    reset,
    refresh,
    loadMore,
    observerRef,
  };
};