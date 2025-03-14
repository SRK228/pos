/**
 * Utility functions to improve application performance
 */

// Debounce function to limit how often a function can be called
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

// Memoize function to cache expensive function results
export function memoize<T extends (...args: any[]) => any>(func: T): T {
  const cache = new Map();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Lazy loading helper for components
export function lazyWithPreload<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
) {
  const Component = React.lazy(factory);
  // Add preload function to the component
  (Component as any).preload = factory;
  return Component;
}

// Image optimization helper
export function getOptimizedImageUrl(
  url: string,
  width: number = 400,
  quality: number = 80,
): string {
  // For unsplash images
  if (url.includes("unsplash.com")) {
    return `${url}?w=${width}&q=${quality}`;
  }

  // For other image sources, you might implement different optimization strategies
  return url;
}

// Virtual list helper for rendering only visible items in a long list
export function useVirtualList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
) {
  const [scrollTop, setScrollTop] = React.useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight));
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight),
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const onScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll,
  };
}
