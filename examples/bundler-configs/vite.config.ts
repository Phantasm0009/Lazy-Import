/**
 * Vite Configuration Example with Static Bundle Helper
 * Optimized for both development and production builds
 */

import { defineConfig } from 'vite';
import { viteLazyImport } from '@phantasm0009/lazy-import/bundler';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    // Add the lazy-import plugin early in the pipeline
    viteLazyImport({
      // Add webpack-style chunk comments (works with Rollup too)
      chunkComment: true,
      
      // Preserve options object for runtime features
      preserveOptions: true,
      
      // Only transform string literals for safety
      stringLiteralsOnly: true,
      
      // Custom chunk naming
      chunkNameTemplate: '[name]-[hash:8]',
      
      // Enable debug logging in development
      debug: process.env.NODE_ENV === 'development',
      
      // Include/exclude patterns
      include: ['**/*.{js,jsx,ts,tsx}'],
      exclude: ['node_modules/**', '**/*.test.*']
    }),
    
    react()
  ],
  
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'date-fns']
        },
        // Consistent chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // Enable source maps for debugging
    sourcemap: true,
    
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  
  server: {
    port: 3000,
    open: true
  },
  
  // Enable optimizeDeps for lazy-loaded modules
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@phantasm0009/lazy-import']
  }
});

// Example usage in your components:
/*
import lazy from '@phantasm0009/lazy-import';

// These will be transformed by Static Bundle Helper:
const Chart = lazy('./components/Chart');           // → Chart-[hash].js
const DataGrid = lazy('./components/DataGrid');     // → DataGrid-[hash].js
const loadUtils = lazy('lodash');                   // → lodash-[hash].js

// With options (preserved functionality):
const heavyLib = lazy('three', { retries: 2 });     // → three-[hash].js + helper
*/
