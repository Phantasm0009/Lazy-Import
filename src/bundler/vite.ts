/**
 * Vite Plugin for @phantasm0009/lazy-import Static Bundle Helper
 */

import type { Plugin } from 'vite';
import { LazyImportTransformer, BundlerTransformOptions } from './index';

export interface ViteLazyImportOptions extends BundlerTransformOptions {
  include?: string[];
  exclude?: string[];
  dev?: boolean;
  build?: boolean;
}

export function viteLazyImport(options: ViteLazyImportOptions = {}): Plugin {
  const transformer = new LazyImportTransformer(options);
  
  const includeExtensions = options.include || ['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte'];
  const excludePatterns = options.exclude || ['node_modules/**', '**/*.test.*', '**/*.spec.*'];
  
  return {
    name: 'vite-lazy-import',
    
    transform(code: string, id: string) {
      const isDev = process.env.NODE_ENV === 'development';
      const isBuild = process.env.NODE_ENV === 'production';
      
      // Check environment flags
      if (isDev && options.dev === false) return;
      if (isBuild && options.build === false) return;
      
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

export default viteLazyImport;
