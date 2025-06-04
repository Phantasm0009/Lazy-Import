import { rollupLazyImport } from '@phantasm0009/lazy-import/bundler';

export default {
  input: 'src/sample.js',
  output: {
    dir: 'dist/rollup',
    format: 'es',
    preserveModules: false
  },
  plugins: [
    rollupLazyImport({
      chunkComment: true,
      preserveOptions: true,
      debug: true
    })
  ],
  external: ['@phantasm0009/lazy-import']
};
