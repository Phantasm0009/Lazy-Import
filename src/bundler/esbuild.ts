/**
 * esbuild Plugin for @phantasm0009/lazy-import Static Bundle Helper
 */

import type { Plugin } from 'esbuild';
import { LazyImportTransformer, BundlerTransformOptions } from './index';

export interface EsbuildLazyImportOptions extends BundlerTransformOptions {
  /**
   * File extensions to transform
   * @default ['.js', '.jsx', '.ts', '.tsx']
   */
  filter?: RegExp;
  
  /**
   * Namespace for the plugin
   * @default 'lazy-import'
   */
  namespace?: string;
}

export function esbuildLazyImport(options: EsbuildLazyImportOptions = {}): Plugin {
  const transformer = new LazyImportTransformer(options);
  const filter = options.filter || /\.(js|jsx|ts|tsx)$/;
  const namespace = options.namespace || 'lazy-import';
  
  return {
    name: 'esbuild-lazy-import',
    setup(build) {
      build.onLoad({ filter, namespace: '' }, async (args) => {
        const fs = await import('fs/promises');
        
        try {
          const source = await fs.readFile(args.path, 'utf8');
          
          // Skip if no lazy() calls found
          if (!source.includes('lazy(')) {
            return null;
          }
          
          const result = transformer.transform(source, args.path);
          
          if (result.transformCount === 0) {
            return null;
          }
          
          if (options.debug) {
            console.log(`[esbuild SBH] Transformed ${result.transformCount} calls in ${args.path}`);
          }
          
          return {
            contents: result.code,
            loader: getLoader(args.path)
          };        } catch (error: unknown) {
          return {
            errors: [{
              text: `Failed to transform lazy imports: ${error instanceof Error ? error.message : String(error)}`,
              location: null
            }]
          };
        }
      });
    }
  };
}

function getLoader(path: string): 'js' | 'jsx' | 'ts' | 'tsx' {
  if (path.endsWith('.tsx')) return 'tsx';
  if (path.endsWith('.ts')) return 'ts';
  if (path.endsWith('.jsx')) return 'jsx';
  return 'js';
}

export default esbuildLazyImport;
