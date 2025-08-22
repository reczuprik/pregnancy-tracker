import { useEffect, useCallback, useRef, useState } from 'react';

/**
 * Performance monitoring hook
 * Provides utilities for measuring and optimizing performance
 */
export function usePerformance() {
  const performanceRef = useRef<Map<string, number>>(new Map());

  const startTiming = useCallback((label: string) => {
    performanceRef.current.set(label, performance.now());
  }, []);

  const endTiming = useCallback((label: string) => {
    const startTime = performanceRef.current.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      performanceRef.current.delete(label);
      
      // Log slow operations in development
      if (process.env.NODE_ENV === 'development' && duration > 100) {
        console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    }
    return 0;
  }, []);

  const measureAsync = useCallback(async <T>(
    label: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    startTiming(label);
    try {
      const result = await operation();
      endTiming(label);
      return result;
    } catch (error) {
      endTiming(label);
      throw error;
    }
  }, [startTiming, endTiming]);

  return {
    startTiming,
    endTiming,
    measureAsync
  };
}

/**
 * Debounce hook for performance optimization
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback((
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }
  ) as T, [delay]);
}

/**
 * Throttle hook for performance optimization
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const inThrottle = useRef(false);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback((
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callbackRef.current(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    }
  ) as T, [limit]);
}

/**
 * Memory usage monitoring hook
 */
export function useMemoryMonitor() {
  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      return {
        used: Math.round(memInfo.usedJSHeapSize / 1048576 * 100) / 100,
        total: Math.round(memInfo.totalJSHeapSize / 1048576 * 100) / 100,
        limit: Math.round(memInfo.jsHeapSizeLimit / 1048576 * 100) / 100
      };
    }
    return null;
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        const memUsage = getMemoryUsage();
        if (memUsage && memUsage.used > 50) {
          console.warn('High memory usage detected:', memUsage);
        }
      }, 10000); // Check every 10 seconds

      return () => clearInterval(interval);
    }
  }, [getMemoryUsage]);

  return { getMemoryUsage };
}

/**
 * Virtual scrolling hook for large lists
 */
export function useVirtualScroll({
  items,
  itemHeight,
  containerHeight
}: {
  items: any[];
  itemHeight: number;
  containerHeight: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  };
}