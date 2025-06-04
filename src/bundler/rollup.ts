/**
 * Rollup Plugin for @phantasm0009/lazy-import Static Bundle Helper
 */

import type { Plugin } from 'rollup';
import { LazyImportTransformer, BundlerTransformOptions } from './index';

export interface RollupLazyImportOptions extends BundlerTransformOptions {
  include?: string[];
  exclude?: string[];
}

export function rollupLazyImport(options: RollupLazyImportOptions = {}): Plugin {
  const transformer = new LazyImportTransformer(options);
  
  const includeExtensions = options.include || ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.es'];
  const excludePatterns = options.exclude || ['node_modules/**', '**/*.test.*', '**/*.spec.*'];

  return {
    name: 'rollup-lazy-import',
    
    transform(code: string, id: string) {
      // Check if file should be excluded
      if (excludePatterns.some(pattern => {
        const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
        return regex.test(id);
      })) {
        return null;
      }

      // Check if file extension should be included
      const ext = id.substring(id.lastIndexOf('.'));
      if (!includeExtensions.includes(ext)) {
        return null;
      }

      // Skip if no lazy() calls found
      if (!code.includes('lazy(')) {
        return null;
      }

      try {
        const result = transformer.transform(code, id);
        
        if (result.transformCount === 0) {
          return null;
        }
        
        return {
          code: result.code,
          map: null
        };
      } catch (error) {
        this.error(`Failed to transform lazy imports in ${id}: ${(error as Error).message}`);
      }
    }
  };
}

export default rollupLazyImport;
