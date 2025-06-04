
import { defineConfig } from 'vite';
import { viteLazyImport } from '@phantasm0009/lazy-import/bundler';

export default defineConfig({
  plugins: [
    viteLazyImport({
      chunkComment: true,
      preserveOptions: true
    })
  ],
  build: {
    outDir: 'dist/with-sbh',
    lib: {
      entry: 'src/index.js',
      name: 'BenchmarkLib',
      formats: ['es']
    },
    rollupOptions: {
      external: ['@phantasm0009/lazy-import']
    }
  }
});
