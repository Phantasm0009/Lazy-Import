import { defineConfig } from 'vite';
import { viteLazyImport } from '@phantasm0009/lazy-import/bundler';

export default defineConfig({  plugins: [
    viteLazyImport({
      chunkComment: true,
      preserveOptions: true,
      debug: true,
      stringLiteralsOnly: true
    })
  ],build: {
    outDir: 'dist/vite',
    lib: {
      entry: 'src/sample.js',
      name: 'TestLib',
      fileName: 'TestLib',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['@phantasm0009/lazy-import']
    }
  }
});
