/**
 * Rollup Configuration Example with Static Bundle Helper
 */

import { rollupLazyImport } from '@phantasm0009/lazy-import/bundler';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/main.ts',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/bundle.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    // Add the lazy-import plugin BEFORE TypeScript
    rollupLazyImport({
      debug: true,
      chunkComment: true,
      preserveOptions: true
    }),
    
    typescript({
      tsconfig: './tsconfig.json'
    }),
    
    nodeResolve({
      preferBuiltins: false
    })
  ],
  
  // Configure code splitting
  external: ['react', 'react-dom'],
  
  // Enable dynamic imports
  experimentalCodeSplitting: true
};
