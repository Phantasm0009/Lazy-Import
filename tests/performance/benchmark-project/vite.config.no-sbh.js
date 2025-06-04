
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist/without-sbh',
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
