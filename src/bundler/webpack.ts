/**
 * Webpack Plugin for @phantasm0009/lazy-import Static Bundle Helper
 */

import type { Compiler, WebpackPluginInstance } from 'webpack';
import { LazyImportTransformer, BundlerTransformOptions } from './index';

export interface WebpackLazyImportOptions extends BundlerTransformOptions {
  /**
   * Test pattern for files to transform
   * @default /\.(js|jsx|ts|tsx)$/
   */
  test?: RegExp;
  
  /**
   * Files to exclude from transformation
   * @default /node_modules/
   */
  exclude?: RegExp;
  
  /**
   * Apply only in production mode
   * @default false
   */
  productionOnly?: boolean;
}

export class WebpackLazyImportPlugin implements WebpackPluginInstance {
  private options: WebpackLazyImportOptions;
  private transformer: LazyImportTransformer;
  
  constructor(options: WebpackLazyImportOptions = {}) {
    this.options = {
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      productionOnly: false,
      ...options
    };
    
    this.transformer = new LazyImportTransformer(options);
  }
  
  apply(compiler: Compiler) {
    const pluginName = 'WebpackLazyImportPlugin';
    
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      const { webpack } = compiler;
      const { sources } = webpack;
      
      // Check if we should apply based on mode
      if (this.options.productionOnly && compiler.options.mode !== 'production') {
        return;
      }
      
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
        },
        (assets) => {
          for (const [pathname, source] of Object.entries(assets)) {
            // Check if file should be processed
            if (!this.shouldTransform(pathname)) {
              continue;
            }
            
            const originalSource = source.source().toString();
            
            // Skip if no lazy() calls found
            if (!originalSource.includes('lazy(')) {
              continue;
            }
            
            try {
              const result = this.transformer.transform(originalSource, pathname);
              
              if (result.transformCount > 0) {
                compilation.updateAsset(pathname, new sources.RawSource(result.code));
                
                if (this.options.debug) {
                  console.log(`[Webpack SBH] Transformed ${result.transformCount} calls in ${pathname}`);
                }
              }            } catch (error: unknown) {
              compilation.errors.push(
                new Error(`Failed to transform lazy imports in ${pathname}: ${error instanceof Error ? error.message : String(error)}`)
              );
            }
          }
        }
      );
    });
  }
  
  private shouldTransform(pathname: string): boolean {
    if (this.options.exclude && this.options.exclude.test(pathname)) {
      return false;
    }
    
    return this.options.test?.test(pathname) ?? true;
  }
}

// Alternative: Webpack Loader approach
export function webpackLazyImportLoader(this: any, source: string) {
  const options = this.getOptions() || {};
  const transformer = new LazyImportTransformer(options);
  
  // Skip if no lazy() calls found
  if (!source.includes('lazy(')) {
    return source;
  }
  
  try {
    const result = transformer.transform(source, this.resourcePath);
    
    if (result.transformCount > 0 && options.debug) {
      console.log(`[Webpack Loader SBH] Transformed ${result.transformCount} calls in ${this.resourcePath}`);
    }
    
    return result.code;  } catch (error: unknown) {
    this.emitError(new Error(`Failed to transform lazy imports: ${error instanceof Error ? error.message : String(error)}`));
    return source;
  }
}

export default WebpackLazyImportPlugin;
