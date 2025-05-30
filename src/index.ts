/**
 * Options for the lazy import function
 */
export interface LazyImportOptions {
  /**
   * Whether to cache the imported module
   * @default true
   */
  cache?: boolean;
  
  /**
   * Number of retries on import failure
   * @default 0
   */
  retries?: number;
  
  /**
   * Delay between retries in milliseconds
   * @default 1000
   */
  retryDelay?: number;
  
  /**
   * Custom error handler
   */
  onError?: (error: Error, attempt: number) => void;
}

/**
 * A type that takes a module and returns a promise of that module
 */
export type LazyImportFunction<T = any> = (() => Promise<T>) & {
  /**
   * Preload the module without using it immediately
   */
  preload: () => Promise<T>;
  
  /**
   * Clear the cached module (if caching is enabled)
   */
  clearCache: () => void;
  
  /**
   * Check if the module is cached
   */
  isCached: () => boolean;
};

/**
 * For testing purposes only - allows us to mock dynamic imports
 */
export const dynamicImport = (path: string) => import(/* @vite-ignore */ path);

/**
 * Cache for imported modules
 */
const importCache = new Map<string, any>();

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Creates a function that will lazily import a module when called
 * 
 * @param modulePath The path to the module to import
 * @param options Options for the lazy import
 * @returns A function that when called will dynamically import the module
 */
function lazy<T = any>(
  modulePath: string,
  options: LazyImportOptions = {}
): LazyImportFunction<T> {
  const {
    cache = true,
    retries = 0,
    retryDelay = 1000,
    onError
  } = options;

  const importWithRetry = async (attempt = 0): Promise<T> => {
    try {
      // Check if module is already in cache
      if (cache && importCache.has(modulePath)) {
        return importCache.get(modulePath);
      }

      // Dynamically import the module
      const module = await dynamicImport(modulePath);
      
      // Cache the result if caching is enabled
      if (cache) {
        importCache.set(modulePath, module);
      }
      
      return module;
    } catch (error) {
      const currentAttempt = attempt + 1;
      
      // Call custom error handler if provided
      if (onError) {
        onError(error as Error, currentAttempt);
      }
      
      // Retry if attempts remaining
      if (currentAttempt <= retries) {
        console.warn(`Error importing module '${modulePath}' (attempt ${currentAttempt}/${retries + 1}):`, error);
        await sleep(retryDelay);
        return importWithRetry(currentAttempt);
      }
      
      // Final error
      console.error(`Error lazily importing module '${modulePath}' after ${currentAttempt} attempts:`, error);
      throw error;
    }
  };

  const lazyFunction = () => importWithRetry();

  // Add preload method
  lazyFunction.preload = () => importWithRetry();

  // Add cache management methods
  lazyFunction.clearCache = () => {
    if (cache && importCache.has(modulePath)) {
      importCache.delete(modulePath);
    }
  };

  lazyFunction.isCached = () => {
    return cache && importCache.has(modulePath);
  };

  return lazyFunction as LazyImportFunction<T>;
}

/**
 * A synchronous-like wrapper for lazy imports
 * Note: This still returns a Promise, but provides a cleaner API
 * 
 * @param modulePath The path to the module to import
 * @param options Options for the lazy import
 */
lazy.sync = function syncLazy<T = any>(
  modulePath: string,
  options?: LazyImportOptions
): LazyImportFunction<T> {
  return lazy<T>(modulePath, options);
};

/**
 * Preload a module without using it immediately
 * 
 * @param modulePath The path to the module to preload
 * @param options Options for the lazy import
 */
lazy.preload = function preload<T = any>(
  modulePath: string,
  options: LazyImportOptions = { cache: true }
): Promise<T> {
  const importer = lazy<T>(modulePath, options);
  return importer.preload();
};

/**
 * Import multiple modules lazily
 * 
 * @param modulePaths An array of module paths to import
 * @param options Options for the lazy imports
 */
lazy.all = function lazyAll<T extends Record<string, any> = Record<string, any>>(
  modulePaths: Record<keyof T, string>,
  options?: LazyImportOptions
): (() => Promise<T>) & {
  preload: () => Promise<T>;
  clearCache: () => void;
  isCached: () => boolean;
} {
  const importers = Object.entries(modulePaths).reduce(
    (acc, [key, path]) => {
      acc[key] = lazy(path, options);
      return acc;
    },
    {} as Record<string, LazyImportFunction<any>>
  );

  const loadAll = async () => {
    const result = {} as T;
    const entries = Object.entries(importers);
    
    for (const [key, importer] of entries) {
      result[key as keyof T] = await importer();
    }
    
    return result;
  };

  const preloadAll = async () => {
    const result = {} as T;
    const entries = Object.entries(importers);
    
    for (const [key, importer] of entries) {
      result[key as keyof T] = await importer.preload();
    }
    
    return result;
  };

  const clearAllCache = () => {
    Object.values(importers).forEach(importer => importer.clearCache());
  };

  const isAllCached = () => {
    return Object.values(importers).every(importer => importer.isCached());
  };

  const allFunction = loadAll as (() => Promise<T>) & {
    preload: () => Promise<T>;
    clearCache: () => void;
    isCached: () => boolean;
  };
  allFunction.preload = preloadAll;
  allFunction.clearCache = clearAllCache;
  allFunction.isCached = isAllCached;

  return allFunction;
};

/**
 * Utility to create a typed lazy import with full TypeScript inference
 */
lazy.typed = function typedLazy<T>(
  modulePath: string,
  options?: LazyImportOptions
): LazyImportFunction<T> {
  return lazy<T>(modulePath, options);
};

/**
 * Clear all cached modules
 */
lazy.clearAllCache = function clearAllCache(): void {
  importCache.clear();
};

/**
 * Get cache statistics
 */
lazy.getCacheStats = function getCacheStats(): {
  size: number;
  keys: string[];
} {
  return {
    size: importCache.size,
    keys: Array.from(importCache.keys())
  };
};

export default lazy;
