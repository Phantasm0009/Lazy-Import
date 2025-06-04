/**
 * Static Bundle Helper (SBH) - Core Transform Logic
 * Transforms lazy() calls into native import() statements for better bundler integration
 */

export interface BundlerTransformOptions {
  /**
   * Add webpack chunk comments for better chunk naming
   * @default true
   */
  chunkComment?: boolean;
  
  /**
   * Preserve options object for runtime
   * @default true
   */
  preserveOptions?: boolean;
  
  /**
   * Only transform string literals, leave dynamic imports untouched
   * @default true
   */
  stringLiteralsOnly?: boolean;
  
  /**
   * Custom chunk name template
   * @default "[name]"
   */
  chunkNameTemplate?: string;
  
  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

export interface TransformResult {
  code: string;
  map?: any;
  transformCount: number;
  skippedCount: number;
}

/**
 * Core transformation logic for converting lazy() calls to import()
 */
export class LazyImportTransformer {
  private options: Required<BundlerTransformOptions>;
  
  constructor(options: BundlerTransformOptions = {}) {
    this.options = {
      chunkComment: true,
      preserveOptions: true,
      stringLiteralsOnly: true,
      chunkNameTemplate: '[name]',
      debug: false,
      ...options
    };
  }
    /**
   * Transform code containing lazy() calls
   */
  transform(code: string, filename?: string): TransformResult {
    let transformCount = 0;
    let skippedCount = 0;
    
    if (this.options.debug) {
      console.log(`[SBH] Transforming ${filename || 'unknown file'}`);
    }
    
    // Skip if no lazy() calls found
    if (!code.includes('lazy(')) {
      return { code, transformCount: 0, skippedCount: 0 };
    }
    
    // Enhanced regex that handles more cases and preserves formatting
    const lazyCallRegex = /(\s*)lazy\s*\(\s*(['"`])([^'"`]+)\2\s*(?:,\s*(\{[^}]*\}))?\s*\)(\s*)/g;
    
    const transformedCode = code.replace(lazyCallRegex, (match, leading, quote, modulePath, optionsStr, trailing) => {
      if (this.options.stringLiteralsOnly && this.containsTemplateVariables(modulePath)) {
        skippedCount++;
        return match;
      }
      
      transformCount++;
      
      const chunkName = this.generateChunkName(modulePath);
      const chunkComment = this.options.chunkComment 
        ? `/* webpackChunkName: "${chunkName}" */ `
        : '';
      
      if (optionsStr && this.options.preserveOptions) {
        // Include helper injection if needed
        const helperCall = `__lazyImportHelper(() => import(${chunkComment}${quote}${modulePath}${quote}), ${optionsStr})`;
        return leading + helperCall + trailing;
      }
      
      // Simple case - direct import() replacement
      return leading + `(() => import(${chunkComment}${quote}${modulePath}${quote}))` + trailing;
    });
    
    // Inject helper if needed and not already present
    let finalCode = transformedCode;
    if (transformedCode.includes('__lazyImportHelper') && !transformedCode.includes('function __lazyImportHelper')) {
      finalCode = this.generateRuntimeHelper() + '\n\n' + transformedCode;
    }
    
    if (this.options.debug) {
      console.log(`[SBH] Transformed ${transformCount} calls, skipped ${skippedCount}`);
    }
    
    return {
      code: finalCode,
      transformCount,
      skippedCount
    };
  }
  
  private containsTemplateVariables(value: string): boolean {
    return value.includes('${') || value.includes('#{') || value.includes('$');
  }
  
  private generateChunkName(modulePath: string): string {
    const name = modulePath
      .replace(/^[./]+/, '') // Remove leading ./ or ../
      .replace(/\.[^.]+$/, '') // Remove extension
      .replace(/[/\\]/g, '-') // Replace path separators
      .replace(/[^a-zA-Z0-9-_]/g, ''); // Remove special chars
    
    return this.options.chunkNameTemplate.replace('[name]', name);
  }
    private generateHelperCall(modulePath: string, optionsStr: string, chunkComment: string): string {
    return `__lazyImportHelper(
      () => import(${chunkComment}'${modulePath}'),
      ${optionsStr}
    )`;
  }
  
  private generateRuntimeHelper(): string {
    return `function __lazyImportHelper(importFn, options = {}) {
  const { cache = true, retries = 0, retryDelay = 1000, onError } = options;
  
  let cachedPromise = null;
  
  const importWithRetry = async (attempt = 0) => {
    try {
      if (cache && cachedPromise) {
        return await cachedPromise;
      }
      
      const modulePromise = importFn();
      
      if (cache) {
        cachedPromise = modulePromise;
      }
      
      return await modulePromise;
    } catch (error) {
      const currentAttempt = attempt + 1;
      
      if (onError) {
        onError(error, currentAttempt);
      }
      
      if (currentAttempt <= retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return importWithRetry(currentAttempt);
      }
      
      throw error;
    }
  };
  
  const lazyFunction = () => importWithRetry();
  lazyFunction.preload = () => importWithRetry();
  lazyFunction.clearCache = () => { cachedPromise = null; };
  lazyFunction.isCached = () => cachedPromise !== null;
  
  return lazyFunction;
}`;
  }
}

/**
 * Runtime helper that preserves lazy-import functionality with native imports
 */
export const runtimeHelper = `
function __lazyImportHelper(importFn, options = {}) {
  const { cache = true, retries = 0, retryDelay = 1000, onError } = options;
  
  let cachedPromise = null;
  
  const importWithRetry = async (attempt = 0) => {
    try {
      if (cache && cachedPromise) {
        return await cachedPromise;
      }
      
      const modulePromise = importFn();
      
      if (cache) {
        cachedPromise = modulePromise;
      }
      
      return await modulePromise;
    } catch (error) {
      const currentAttempt = attempt + 1;
      
      if (onError) {
        onError(error, currentAttempt);
      }
      
      if (currentAttempt <= retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return importWithRetry(currentAttempt);
      }
      
      throw error;
    }
  };
  
  const lazyFunction = () => importWithRetry();
  lazyFunction.preload = () => importWithRetry();
  lazyFunction.clearCache = () => { cachedPromise = null; };
  lazyFunction.isCached = () => cachedPromise !== null;
  
  return lazyFunction;
}
`;

export { LazyImportTransformer as default };
