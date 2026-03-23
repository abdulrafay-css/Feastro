/**
 * useIntersectionObserver Hook
 * Detect when an element enters/exits viewport
 * 
 * Usage:
 * const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });
 */

import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef(null);

  const defaultOptions = {
    threshold: 0.1,
    root: null,
    rootMargin: '0px',
    triggerOnce: false,
    ...options,
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);

        if (visible && !hasIntersected) {
          setHasIntersected(true);
        }

        // If triggerOnce is true, disconnect after first intersection
        if (visible && defaultOptions.triggerOnce) {
          observer.disconnect();
        }
      },
      {
        threshold: defaultOptions.threshold,
        root: defaultOptions.root,
        rootMargin: defaultOptions.rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [defaultOptions.threshold, defaultOptions.root, defaultOptions.rootMargin, defaultOptions.triggerOnce, hasIntersected]);

  return [elementRef, isVisible, hasIntersected];
};

export default useIntersectionObserver;