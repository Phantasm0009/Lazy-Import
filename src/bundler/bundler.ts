/**
 * Bundler Plugin Exports for @phantasm0009/lazy-import Static Bundle Helper
 * 
 * This file provides all bundler integrations in one place
 */

export { LazyImportTransformer, runtimeHelper } from './index';
export type { BundlerTransformOptions, TransformResult } from './index';

// Babel plugin
export { default as babelPlugin } from './babel';
export type { BabelPluginOptions } from './babel';

// Rollup plugin  
export { rollupLazyImport, default as rollup } from './rollup';
export type { RollupLazyImportOptions } from './rollup';

// Vite plugin
export { viteLazyImport, default as vite } from './vite';
export type { ViteLazyImportOptions } from './vite';

// Webpack plugin
export { WebpackLazyImportPlugin, webpackLazyImportLoader } from './webpack';
export type { WebpackLazyImportOptions } from './webpack';

// esbuild plugin
export { esbuildLazyImport, default as esbuild } from './esbuild';
export type { EsbuildLazyImportOptions } from './esbuild';

// Import for convenience exports
import { default as babelDefault } from './babel';
import { rollupLazyImport } from './rollup';
import { viteLazyImport } from './vite';
import { WebpackLazyImportPlugin } from './webpack';
import { esbuildLazyImport } from './esbuild';

// Convenience exports for common use cases
export const plugins = {
  babel: babelDefault,
  rollup: rollupLazyImport,
  vite: viteLazyImport,
  webpack: WebpackLazyImportPlugin,
  esbuild: esbuildLazyImport
};
