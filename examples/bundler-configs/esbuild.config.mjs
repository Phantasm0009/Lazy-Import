/**
 * esbuild Configuration Example with Static Bundle Helper
 */

import { build } from 'esbuild';
import { esbuildLazyImport } from '@phantasm0009/lazy-import/bundler';

await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  sourcemap: true,
  splitting: true,
  outdir: 'dist',
  
  plugins: [
    esbuildLazyImport({
      debug: true,
      chunkComment: true,
      preserveOptions: true
    })
  ],
  
  // Enable code splitting
  splitting: true,
  format: 'esm',
  
  // External dependencies
  external: ['react', 'react-dom']
});
